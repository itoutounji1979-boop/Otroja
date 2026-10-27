// Otroja site worker: serves the static site and a tiny privacy-friendly view counter.
// Data lives in one SQLite-backed Durable Object. No cookies, no personal data:
// visitors are a random id stored in their own browser, hashed again here.
import { DurableObject } from "cloudflare:workers";

const json = (d, s = 200, extra = {}) =>
  new Response(JSON.stringify(d), { status: s, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra } });
const KEY_RE = /^[a-z0-9_-]{1,60}$/i;
const day = (t = Date.now()) => new Date(t + 2 * 3600e3).toISOString().slice(0, 10); // Beirut-ish day

async function sha(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].slice(0, 8).map(x => x.toString(16).padStart(2, "0")).join("");
}

export class Stats extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS views(k TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS seen(d TEXT, v TEXT, k TEXT, PRIMARY KEY(d,v,k));
      CREATE TABLE IF NOT EXISTS visitors(d TEXT, v TEXT, country TEXT, dev TEXT, ref TEXT, PRIMARY KEY(d,v));
      CREATE TABLE IF NOT EXISTS daily(d TEXT, k TEXT, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(d,k));`);
  }
  hit(k, v, country, dev, ref) {
    const d = day();
    const fresh = this.sql.exec("INSERT OR IGNORE INTO seen(d,v,k) VALUES(?,?,?) RETURNING 1", d, v, k).toArray().length > 0;
    this.sql.exec("INSERT OR IGNORE INTO visitors(d,v,country,dev,ref) VALUES(?,?,?,?,?)", d, v, country, dev, ref);
    if (fresh) {
      this.sql.exec("INSERT INTO views(k,n) VALUES(?,1) ON CONFLICT(k) DO UPDATE SET n=n+1", k);
      this.sql.exec("INSERT INTO daily(d,k,n) VALUES(?,?,1) ON CONFLICT(d,k) DO UPDATE SET n=n+1", d, k);
    }
    // keep the dedupe table small
    if (Math.random() < 0.01) this.sql.exec("DELETE FROM seen WHERE d < ?", day(Date.now() - 3 * 864e5));
    return fresh;
  }
  views() {
    const o = {};
    for (const r of this.sql.exec("SELECT k,n FROM views")) o[r.k] = r.n;
    return o;
  }
  report(days = 30) {
    const since = day(Date.now() - days * 864e5);
    const q = (s, ...a) => this.sql.exec(s, ...a).toArray();
    return {
      generated: new Date().toISOString(),
      totals: {
        visitorsAll: q("SELECT COUNT(DISTINCT v) n FROM visitors")[0].n,
        visitorsToday: q("SELECT COUNT(*) n FROM visitors WHERE d=?", day())[0].n,
        readsAll: q("SELECT COALESCE(SUM(n),0) n FROM views")[0].n,
      },
      perDay: q("SELECT d, COUNT(*) visitors FROM visitors WHERE d>=? GROUP BY d ORDER BY d", since),
      readsPerDay: q("SELECT d, SUM(n) reads FROM daily WHERE d>=? GROUP BY d ORDER BY d", since),
      topAll: q("SELECT k, n FROM views ORDER BY n DESC LIMIT 40"),
      topRecent: q("SELECT k, SUM(n) n FROM daily WHERE d>=? GROUP BY k ORDER BY n DESC LIMIT 25", day(Date.now() - 7 * 864e5)),
      countries: q("SELECT country, COUNT(*) n FROM visitors WHERE d>=? GROUP BY country ORDER BY n DESC LIMIT 12", since),
      devices: q("SELECT dev, COUNT(*) n FROM visitors WHERE d>=? GROUP BY dev ORDER BY n DESC", since),
      refs: q("SELECT ref, COUNT(*) n FROM visitors WHERE d>=? AND ref<>'' GROUP BY ref ORDER BY n DESC LIMIT 12", since),
    };
  }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(req);
    const stub = env.STATS.get(env.STATS.idFromName("otroja"));
    try {
      if (url.pathname === "/api/hit" && req.method === "POST") {
        const b = await req.json().catch(() => ({}));
        const k = String(b.k || ""), v0 = String(b.v || "");
        if (!KEY_RE.test(k) || !v0 || v0.length > 80) return json({ ok: false }, 400);
        const ua = req.headers.get("user-agent") || "";
        if (/bot|crawl|spider|preview|facebookexternalhit|whatsapp/i.test(ua)) return json({ ok: true, bot: true });
        const v = await sha(v0 + (env.SALT || "otroja"));
        const dev = (b.w || 0) < 700 || /Mobi|Android|iPhone/i.test(ua) ? "هاتف" : "كمبيوتر";
        const ref = String(b.r || "").slice(0, 60).replace(/^www\./, "");
        const country = (req.cf && req.cf.country) || "؟";
        await stub.hit(k, v, country, dev, ref);
        return json({ ok: true });
      }
      if (url.pathname === "/api/views") return json(await stub.views(), 200, { "cache-control": "public, max-age=60" });
      if (url.pathname === "/api/stats") {
        const key = url.searchParams.get("key") || req.headers.get("x-admin-key") || "";
        if (!env.ADMIN_KEY) return json({ error: "ADMIN_KEY غير مضبوط في إعدادات Cloudflare" }, 503);
        if (key !== env.ADMIN_KEY) return json({ error: "مفتاح غير صحيح" }, 401);
        return json(await stub.report(Math.min(90, +url.searchParams.get("days") || 30)));
      }
      return json({ error: "not found" }, 404);
    } catch (e) {
      return json({ error: "server" }, 500);
    }
  },
};
