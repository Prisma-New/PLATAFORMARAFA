import crypto from "node:crypto";

const api = process.env.API_URL ?? "http://localhost:4000";
const appSecret = process.env.APP_SECRET ?? "";

function hmacHex(buf) {
  return crypto.createHmac("sha256", appSecret).update(buf).digest("hex");
}

async function send(path, bodyBuf, signatureHex) {
  const r = await fetch(api + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hub-signature-256": signatureHex ? `sha256=${signatureHex}` : "",
    },
    body: bodyBuf,
  });
  const t = await r.text();
  let json;
  try {
    json = JSON.parse(t);
  } catch {
    json = t;
  }
  return { status: r.status, ok: r.ok, body: json };
}

async function main() {
  const payload = { object: "whatsapp_business_account", entry: [{ id: "test", changes: [] }] };
  const buf = Buffer.from(JSON.stringify(payload), "utf8");

  console.log("== Test: missing signature ==");
  console.log(await send("/whatsapp/webhook", buf, ""));

  if (!appSecret) {
    console.log("APP_SECRET not set; skipping valid signature test.");
    return;
  }

  const sig = hmacHex(buf);
  console.log("== Test: valid signature ==");
  console.log(await send("/whatsapp/webhook", buf, sig));

  console.log("== Test: bad signature format ==");
  const r = await fetch(api + "/whatsapp/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-hub-signature-256": "badformat" },
    body: buf,
  });
  console.log({ status: r.status, ok: r.ok });
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
