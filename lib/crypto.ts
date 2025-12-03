import crypto from "crypto";

const ALGO = "aes-256-gcm";
const KEY = process.env.APP_MASTER_KEY || "";

if (!KEY || KEY.length < 32) {
  throw new Error("APP_MASTER_KEY missing or too short (min 32 chars)");
}

export function encrypt(text: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(KEY.slice(0,32)), iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(enc: string) {
  const raw = Buffer.from(enc, "base64");
  const iv = raw.slice(0,12);
  const tag = raw.slice(12,28);
  const data = raw.slice(28);
  const decipher = crypto.createDecipheriv(ALGO, Buffer.from(KEY.slice(0,32)), iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(data), decipher.final()]);
  return out.toString("utf8");
}
