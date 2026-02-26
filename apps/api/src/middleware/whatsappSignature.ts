import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export async function verifyWhatsAppSignature(req: Request, res: Response, next: NextFunction) {
  const appSecret = process.env.APP_SECRET ?? "";
  const rawBody = req.body as Buffer;
  const signatureHeader = (req.header("x-hub-signature-256") ?? "").toLowerCase();
  const metaBase = {
    ip: req.ip,
    userAgent: req.get("user-agent") ?? "",
    contentType: req.get("content-type") ?? "",
    bodyLen: Buffer.isBuffer(rawBody) ? rawBody.length : 0,
    signatureHeaderPresent: signatureHeader.length > 0,
    signaturePrefix: signatureHeader.slice(0, 16),
  };

  function audit(reason: string) {
    try {
      void prisma.$queryRaw`
        INSERT INTO "AuditLog"("actorUserId","entityType","entityId","action","meta")
        VALUES (NULL, 'Webhook', NULL, 'WHATSAPP_WEBHOOK_SIGNATURE_INVALID', ${JSON.stringify({ ...metaBase, reason })})
      `;
    } catch {}
  }

  if (!signatureHeader) {
    audit("missing_signature");
    return res.status(401).json({ message: "Missing signature" });
  }
  if (!appSecret) {
    audit("missing_app_secret");
    return res.status(500).json({ message: "App secret not configured" });
  }
  if (!signatureHeader.startsWith("sha256=")) {
    audit("bad_format");
    return res.status(401).json({ message: "Bad signature format" });
  }
  const expectedHex = signatureHeader.slice("sha256=".length);

  let computedHex = "";
  try {
    computedHex = crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");
  } catch {
    audit("compute_error");
    return res.status(500).json({ message: "Signature compute error" });
  }

  const a = Buffer.from(expectedHex, "hex");
  const b = Buffer.from(computedHex, "hex");
  if (a.length !== b.length) {
    audit("length_mismatch");
    return res.status(401).json({ message: "Invalid signature" });
  }
  const ok = crypto.timingSafeEqual(a, b);
  if (!ok) {
    audit("mismatch");
    return res.status(401).json({ message: "Invalid signature" });
  }
  return next();
}
