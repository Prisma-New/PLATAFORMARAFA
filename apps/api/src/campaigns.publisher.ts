import { prisma } from "./lib/prisma.js";
import { getProviderByName } from "./providers.js";

function getPublicApiBaseUrl() {
  const fromEnv = process.env.PUBLIC_API_URL ?? process.env.API_PUBLIC_URL ?? "";
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  const port = Number(process.env.PORT_API ?? process.env.API_PORT ?? 4000);
  return `http://localhost:${port}`;
}

export function startCampaignPublisher() {
  const pollMs = Math.max(2_000, Number(process.env.PUBLISHER_POLL_MS ?? 15_000));
  const maxBatch = Math.max(1, Math.min(25, Number(process.env.PUBLISHER_BATCH ?? 10)));
  const publicApiBaseUrl = getPublicApiBaseUrl();

  async function tick() {
    try {
      const due = await prisma.$queryRaw<{
        id: string;
        copyText: string;
        channelId: string;
        channelName: string;
        platformRef: string | null;
        platform: string;
      }>`
        SELECT
          c.id::text AS id,
          c."copyText" AS "copyText",
          c."channelId"::text AS "channelId",
          ch.name AS "channelName",
          ch."platformRef" AS "platformRef",
          ch.platform::text AS platform
        FROM "Campaign" c
        JOIN "Channel" ch ON ch.id = c."channelId"
        WHERE c.status = 'PUBLISHED'::"CampaignStatus"
          AND c."publishedAt" IS NULL
          AND c."startAt" IS NOT NULL
          AND c."endAt" IS NOT NULL
          AND c."startAt" <= NOW()
          AND c."endAt" > NOW()
          AND ch.status = 'ACTIVE'::"ChannelStatus"
        ORDER BY c."startAt" ASC
        LIMIT ${maxBatch}
      `;

      for (const row of due.rows ?? []) {
        const provider = getProviderByName(row.platform as "TELEGRAM" | "DISCORD" | "WHATSAPP" | "INSTAGRAM");
        if (!provider?.capabilities.supportsMessageSend) {
          try {
            const already = await prisma.$queryRaw<{ count: string }>`
              SELECT COUNT(*)::text AS count
              FROM "AuditLog"
              WHERE "entityType" = 'Campaign' AND "entityId" = ${row.id}::uuid AND action = 'PUBLISH_MANUAL_REQUIRED'
            `;
            const has = Number(already.rows[0]?.count ?? 0) > 0;
            if (!has) {
              await prisma.$queryRaw`
                INSERT INTO "AuditLog"("actorUserId","entityType","entityId","action","meta")
                VALUES (NULL, 'Campaign', ${row.id}::uuid, 'PUBLISH_MANUAL_REQUIRED', ${JSON.stringify({ platform: row.platform, channelId: row.channelId })})
              `;
            }
          } catch {}
          continue;
        }
        if (!row.platformRef) {
          try {
            await prisma.$queryRaw`
              INSERT INTO "AuditLog"("actorUserId","entityType","entityId","action","meta")
              VALUES (NULL, 'Campaign', ${row.id}::uuid, 'PUBLISH_FAILED', ${JSON.stringify({ reason: "MISSING_PLATFORM_REF", channelId: row.channelId })})
            `;
          } catch {}
          continue;
        }

        // Idempotencia + rate limit
        const rateMinutes = Math.max(1, Number(process.env.PUBLISH_RATE_LIMIT_MINUTES ?? 10));
        const rateRes = await prisma.$queryRaw<{ count: string }>`
          SELECT COUNT(*)::text AS count
          FROM "MessageDelivery"
          WHERE "campaignId" = ${row.id}::uuid
            AND "channelId" = ${row.channelId}::uuid
            AND platform = ${row.platform}::"ChannelPlatform"
            AND "createdAt" >= NOW() - (${String(rateMinutes)} || ' minutes')::interval
        `;
        const recentCount = Number(rateRes.rows[0]?.count ?? 0);
        if (recentCount > 0) {
          try {
            await prisma.$queryRaw`
              INSERT INTO "AuditLog"("actorUserId","entityType","entityId","action","meta")
              VALUES (NULL, 'Campaign', ${row.id}::uuid, 'PUBLISH_SKIPPED_RATE_LIMIT', ${JSON.stringify({ channelId: row.channelId, platform: row.platform, minutes: rateMinutes })})
            `;
          } catch {}
          continue;
        }
        const alreadyRes = await prisma.$queryRaw<{ count: string }>`
          SELECT COUNT(*)::text AS count
          FROM "MessageDelivery"
          WHERE "campaignId" = ${row.id}::uuid
            AND "channelId" = ${row.channelId}::uuid
            AND platform = ${row.platform}::"ChannelPlatform"
            AND status IN ('SENT'::"MessageDeliveryStatus",'DELIVERED'::"MessageDeliveryStatus",'READ'::"MessageDeliveryStatus")
        `;
        const already = Number(alreadyRes.rows[0]?.count ?? 0) > 0;
        if (already) {
          try {
            await prisma.$queryRaw`
              INSERT INTO "AuditLog"("actorUserId","entityType","entityId","action","meta")
              VALUES (NULL, 'Campaign', ${row.id}::uuid, 'PUBLISH_SKIPPED_EXISTS', ${JSON.stringify({ channelId: row.channelId, platform: row.platform })})
            `;
          } catch {}
          continue;
        }

        const trackingUrl = `${publicApiBaseUrl}/r/${row.id}`;
        const text = `${row.copyText}\n\n${trackingUrl}`;

        const sent = await provider.sendMessage({ channelRef: row.platformRef, text });
        if (!sent.ok) {
          try {
            await prisma.$queryRaw`
              INSERT INTO "AuditLog"("actorUserId","entityType","entityId","action","meta")
              VALUES (NULL, 'Campaign', ${row.id}::uuid, 'PUBLISH_FAILED', ${JSON.stringify({ reason: "PROVIDER_SEND_FAILED", channelId: row.channelId })})
            `;
          } catch {}
          try {
            await prisma.$queryRaw`
              INSERT INTO "MessageDelivery"("campaignId","channelId","platform","messageId","status","errorCode","errorMessage")
              VALUES (${row.id}::uuid, ${row.channelId}::uuid, ${row.platform}::"ChannelPlatform", ${sent.providerRef ?? null}, 'FAILED'::"MessageDeliveryStatus", ${sent.errorCode ?? null}, ${sent.errorMessage ? String(sent.errorMessage).slice(0, 300) : null})
              ON CONFLICT ("messageId") DO NOTHING
            `;
          } catch {}
          continue;
        }

        const updated = await prisma.$queryRaw`
          UPDATE "Campaign"
          SET "publishedAt" = NOW()
          WHERE id = ${row.id}::uuid
            AND "publishedAt" IS NULL
        `;
        if ((updated.rowCount ?? 0) > 0) {
          try {
            await prisma.$queryRaw`
              INSERT INTO "AuditLog"("actorUserId","entityType","entityId","action","meta")
              VALUES (NULL, 'Campaign', ${row.id}::uuid, 'PUBLISH_SENT', ${JSON.stringify({ provider: row.platform, providerRef: sent.providerRef ?? null, channelId: row.channelId })})
            `;
          } catch {}
          try {
            await prisma.$queryRaw`
              INSERT INTO "MessageDelivery"("campaignId","channelId","platform","messageId","status")
              VALUES (${row.id}::uuid, ${row.channelId}::uuid, ${row.platform}::"ChannelPlatform", ${sent.providerRef ?? null}, 'SENT'::"MessageDeliveryStatus")
              ON CONFLICT ("messageId") DO NOTHING
            `;
          } catch {}
        }
      }
    } catch {}
  }

  void tick();
  setInterval(() => void tick(), pollMs);
}
