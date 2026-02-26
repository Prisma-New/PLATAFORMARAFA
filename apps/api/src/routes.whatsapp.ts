import express, { Router } from "express";
import { prisma } from "./lib/prisma.js";
import { verifyWhatsAppSignature } from "./middleware/whatsappSignature.js";

const router = Router();

router.get("/whatsapp/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  if (mode === "subscribe" && token && challenge && token === verifyToken) {
    return res.status(200).send(String(challenge));
  }
  return res.status(403).json({ message: "Verification failed" });
});

router.post(
  "/whatsapp/webhook",
  express.raw({ type: "application/json" }),
  verifyWhatsAppSignature,
  async (req, res) => {
    const raw = req.body as Buffer;
    let parsed: unknown = {};
    try {
      parsed = JSON.parse(raw.toString("utf8"));
    } catch {
      parsed = { parse_error: true };
    }
    const jsonStr = JSON.stringify(parsed);
    const truncated = jsonStr.length > 2000 ? jsonStr.slice(0, 2000) + "...(truncated)" : jsonStr;
    try {
      await prisma.$queryRaw`
        INSERT INTO "AuditLog"("actorUserId","entityType","entityId","action","meta")
        VALUES (NULL, 'Webhook', NULL, 'WHATSAPP_WEBHOOK_RECEIVED', ${truncated})
      `;
    } catch {}
    // Status updates
    try {
      const obj = parsed as any;
      const entries = Array.isArray(obj?.entry) ? obj.entry : [];
      for (const entry of entries) {
        const changes = Array.isArray(entry?.changes) ? entry.changes : [];
        for (const ch of changes) {
          const statuses = Array.isArray(ch?.value?.statuses) ? ch.value.statuses : [];
          for (const st of statuses) {
            const messageId: string | undefined = st?.id ?? st?.message_id ?? undefined;
            const statusRaw: string | undefined = st?.status ?? undefined;
            const ts: string | undefined = st?.timestamp ?? undefined;
            const errorsArr = Array.isArray(st?.errors) ? st.errors : [];
            const err = errorsArr[0] ?? undefined;
            const statusMap: Record<string, "SENT" | "DELIVERED" | "READ" | "FAILED"> = {
              sent: "SENT",
              delivered: "DELIVERED",
              read: "READ",
              failed: "FAILED",
            };
            const mapped = statusRaw && statusMap[statusRaw.toLowerCase()] ? statusMap[statusRaw.toLowerCase()] : undefined;
            if (!messageId || !mapped) continue;
            const errorCode = err?.code != null ? String(err.code) : undefined;
            const errorMessage = err?.title ?? err?.message ?? undefined;
            try {
              await prisma.$queryRaw`
                INSERT INTO "MessageDelivery"("messageId","status","errorCode","errorMessage","platform","updatedAt")
                VALUES (${messageId}, ${mapped}::"MessageDeliveryStatus", ${errorCode ?? null}, ${errorMessage ? String(errorMessage).slice(0, 300) : null}, 'WHATSAPP'::"ChannelPlatform", NOW())
                ON CONFLICT ("messageId") DO UPDATE SET
                  status = EXCLUDED.status,
                  "errorCode" = EXCLUDED."errorCode",
                  "errorMessage" = EXCLUDED."errorMessage",
                  "updatedAt" = EXCLUDED."updatedAt"
              `;
            } catch {}
            try {
              await prisma.$queryRaw`
                INSERT INTO "AuditLog"("actorUserId","entityType","entityId","action","meta")
                VALUES (NULL, 'Webhook', NULL, 'WHATSAPP_STATUS_UPDATE', ${JSON.stringify({ messageId, status: mapped, hasError: !!errorMessage, errorCode, timestamp: ts })})
              `;
            } catch {}
            // Attempt correlation via AuditLog PUBLISH_SENT
            try {
              const corr = await prisma.$queryRaw<{ entityId: string; channelId: string }>`
                SELECT "entityId"::text AS "entityId", (meta::jsonb ->> 'channelId')::text AS "channelId"
                FROM "AuditLog"
                WHERE "entityType" = 'Campaign'
                  AND action = 'PUBLISH_SENT'
                  AND meta LIKE ${`%${messageId}%`}
                ORDER BY ts DESC
                LIMIT 1
              `;
              const campaignId = corr.rows[0]?.entityId;
              const channelId = corr.rows[0]?.channelId;
              if (campaignId && channelId) {
                await prisma.$queryRaw`
                  UPDATE "MessageDelivery"
                  SET "campaignId" = ${campaignId}::uuid, "channelId" = ${channelId}::uuid
                  WHERE "messageId" = ${messageId}
                `;
              }
            } catch {}
          }
        }
      }
    } catch {}
    return res.status(200).json({ received: true });
  },
);

export default router;
