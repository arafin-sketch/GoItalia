// Optional on-demand live-train proxy for ItaliaNow (Cloudflare Worker, free tier).
//
// The app can't call RFI's ViaggiaTreno directly (plain HTTP, no CORS, bot protection).
// The GitHub workflow covers the main stations as a static file; deploy this Worker to get
// live boards for ANY station on demand, then set TRAINS_PROXY in config.js to its URL.
//
// Deploy:  npm i -g wrangler  &&  wrangler deploy tools/trains/worker.js --name italianow-trains
// Endpoints:
//   /station/<CODE>      live departure board for a ViaggiaTreno station code (e.g. S08409)
//   /search/<TEXT>       station name -> code autocomplete
//
// It adds CORS, a browser User-Agent, and caches each answer for 30 s so ViaggiaTreno is
// never hit more than ~2x/minute per station regardless of how many people use the app.
const BASE = "http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const CORS = { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=30" };

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const [, kind, arg] = url.pathname.split("/");
    try {
      if (kind === "search") {
        const r = await vt(`${BASE}/autocompletaStazione/${encodeURIComponent(arg.toUpperCase())}`, "text");
        const items = r.trim().split("\n").filter(Boolean).map(l => { const [name, code] = l.split("|"); return { name, code }; });
        return json(items);
      }
      if (kind === "station") {
        const now = new Date().toUTCString().replace("GMT", "GMT+0000"); // ViaggiaTreno wants a date in the path
        const d = encodeURIComponent(new Date().toString());
        const raw = await vt(`${BASE}/partenze/${encodeURIComponent(arg)}/${d}`, "json");
        return json(board(raw));
      }
      return new Response("Not found", { status: 404, headers: CORS });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), { status: 502, headers: { ...CORS, "Content-Type": "application/json" } });
    }
  },
};

async function vt(u, as) {
  const r = await fetch(u, { headers: { "User-Agent": UA, Accept: "application/json, text/plain, */*", Referer: "http://www.viaggiatreno.it/infomobilita/index.jsp" }, cf: { cacheTtl: 30 } });
  if (!r.ok) throw new Error("ViaggiaTreno " + r.status);
  return as === "json" ? r.json() : r.text();
}
function json(v) { return new Response(JSON.stringify(v), { headers: { ...CORS, "Content-Type": "application/json" } }); }
function board(raw) {
  return raw.slice(0, 14).map(x => {
    const tracked = !x.nonPartito;
    return { n: String(x.numeroTreno || "").trim(), c: (x.categoria || "").trim(), to: (x.destinazione || "").trim(),
      t: (x.compOrarioPartenza || "").trim(), d: tracked && x.ritardo != null ? x.ritardo : null,
      p: (x.binarioEffettivoPartenzaDescrizione || x.binarioProgrammatoPartenzaDescrizione || "").trim(),
      x: x.provvedimento === 1, part: x.provvedimento === 2, g: tracked && !x.inStazione };
  });
}
