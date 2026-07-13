// api/vote.js — Snow's Family

// Acepta cualquiera de los nombres que puede inyectar Vercel/Upstash
const R_URL =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.REDIS_URL;

const R_TOKEN =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_READ_ONLY_TOKEN;

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT  = process.env.TELEGRAM_CHAT_ID;

const BROTHER = ["Shadow", "Bruno", "Kobi"];
const DAD     = ["Atlas", "Kong", "Otis"];

async function redis(...cmd) {
  const r = await fetch(R_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${R_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd)
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

async function telegram(text) {
  if (!TG_TOKEN || !TG_CHAT) return;
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT, text })
    });
  } catch (e) {}
}

async function throttled(ip, action, seconds) {
  const ok = await redis("SET", `lock:${action}:${ip}`, "1", "NX", "EX", String(seconds));
  return ok === null;
}

export default async function handler(req, res) {
  const ip = (req.headers["x-forwarded-for"] || "0.0.0.0").split(",")[0].trim();

        
