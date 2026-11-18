(() => {
"use strict";
const CFG = window.ITALIANOW_CONFIG;
const TZ = "Europe/Rome";
const $ = (s, r = document) => r.querySelector(s);
const app = $("#app");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem("itnow:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("itnow:" + k, JSON.stringify(v)); } catch {} },
};

/* ================= i18n ================= */
const STR = {
 en: {
  good_morning: "Good morning", good_afternoon: "Good afternoon", good_evening: "Good evening", good_night: "Good night", departing: "Departing nearby", see_all_stops: "All stops nearby", set: "Set", service_alerts: "Service alerts", prices_auto: "Prices are read from the official websites every day.", checked_on: "Checked {d}",
  tickets: "Tickets", ticket_prices: "Ticket prices", tickets_in: "Tickets in {c}", from_price: "from {p}", valid_min: "Valid {m} min", fare_other: "Train or regional fare: check with the operator", fare_n: "{n} × {t}", prices_checked: "Official prices from {o}, checked {d}.", official_site: "Official website", no_prices: "We couldn't verify prices for this city yet. See the operator's website.", paper: "{p} on paper",
  home_tab: "Home", stations: "Stations", nearest: "Nearest stops", favourites: "Favourites", stop_code: "Stop {c}", walk_min: "{m} min walk", all_deps: "All departures", scheduled: "Scheduled", search_line: "Search for a line", alerts: "Alerts", recent_lines: "Recent", clear: "Clear", no_alerts: "No service alerts reported right now.", no_fav_stops: "No favourite stops yet. Tap the star on a stop to add it.", no_fav_lines: "No favourite lines yet. Tap the star on a line to add it.", show_more: "Show more", direction: "Direction", tap_stop: "Tap a stop to see when this line arrives there.", vehicles_now: n => n === 1 ? "1 vehicle on the line now" : `${n} vehicles on the line now`, no_lines: "No lines match your search.", loading_lines: "Loading lines…", n_alerts: n => n === 1 ? "1 service alert" : `${n} service alerts`, add_fav: "Add to favourites", remove_fav: "Remove from favourites", lines_at: "Lines", no_live_here: "No departures of this line in the next hour.", city: "City",
  plan: "Directions", nearby: "Nearby", where_to: "Where to?", set_home: "Set home", set_work: "Set work", save_place: "Save this destination", saved_places: "Saved places", remove: "Remove", share: "Share", copied: "Copied", install: "Install app", install_s: "Add ItaliaNow to your home screen.", sort_by: "Sort", set_hint: "Search for a place, then save it as Home or Work from the results.", lines: "Lines", saved: "Saved", more: "More",
  from: "From", to: "To", choose_start: "Choose start", choose_dest: "Choose destination", swap: "Swap start and destination",
  now: "Now", depart_at: "Depart at", arrive_by: "Arrive by", search: "Search routes", fewest: "Fewest changes", fastest: "Fastest",
  my_location: "My location", pick_map: "Pick on map", pick_hint: "Tap the map to choose a place",
  live: "Live", offline: "Offline", offline_note: "Can't reach the journey planner. Showing routes from the built-in metro and tram network.",
  min: "min", h: "h", changes: n => n === 0 ? "Direct" : n === 1 ? "1 change" : `${n} changes`,
  walk: "Walk", walk_m: "Walk {d}", stops: n => n === 1 ? "1 stop" : `${n} stops`, platform: "Platform", towards: "to",
  on_time: "On time", late: "+{m} min", early: "−{m} min", cancelled: "Cancelled", est: "≈ times from timetable frequency",
  every: "every {m} min", no_service: "No departures soon", details: "Journey", back: "Back",
  no_routes: "No routes found", no_routes_s: "Try a different time, or places closer to a stop.",
  same_city: "Offline routing works inside one city. Connect to plan across Italy.", retry: "Try again", pick_both: "Choose a start and a destination",
  arrive: "Arrive", depart: "Depart", total_walk: "{d} walking",
  nearby_title: "Departures nearby", within: "Stops within {r} m", updated: "Updated {t} · refreshes every {s} s", updating: "Updating…",
  no_stops: "No stops within {r} m", no_stops_s: "Move the map and tap Search this area.",
  search_here: "Search this area",
  ob_title: "Departures around you, live", ob_body: "ItaliaNow uses your location to show the stops and departures near you and to start your journeys. It stays on your device and is sent only with your route requests.",
  ob_allow: "Allow location", ob_skip: "Not now",
  loc_denied: "Location is off. Showing departures around the map centre. You can turn it on in your browser settings.",
  loc_err: "Couldn't get your location. Showing the map centre instead.", locating: "Finding your location…",
  metro: "Metro", tram: "Tram", rail: "Rail", funicular: "Funicular",
  first: "First", last: "Last", stations: "Stations", frequency: "Weekday frequency", branch: "Branch",
  station: "Station", interchange: "Interchanges", next_dep: "Next departures", walk_to: "{t} min walk",
  saved_title: "Saved", home: "Home", work: "Work", recent: "Recent searches", no_recent: "Searches you make appear here.",
  set_from_search: "Search for a place in Plan, then save it.", save_as: "Save destination as",
  settings: "Settings", language: "Language", theme: "Theme", system: "System", light: "Light", dark: "Dark",
  crash: "Send crash reports", crash_s: "Anonymous reports via Sentry. Off unless you turn it on.",
  sim_off: "Simulate offline", sim_off_s: "Use only the built-in network, as if there were no connection.",
  privacy: "Privacy policy", attributions: "Attributions", strikes: "Strike calendar",
  strike_today: "Strike today: service only in guaranteed hours", strike_soon: "Strike on {d}", strike_cal: "Official calendar",
  net_stats: "{l} lines · {s} stations", loading: "Searching…", estimated: "Estimated",
  place: "Place", stop: "Stop", address: "Address", ref_day: "Timetable reference day {d}", license: "Licence", open_link: "Open",
  err_title: "Couldn't load departures", err_body: "Check your connection and try again.", in_min: "in {m} min", due: "now",
  all: "All", bus: "Bus", train: "Train", ferry: "Ferry", other: "Other", trip: "Trip", live_vehicles: "Live vehicles", lines_hint: "Buses, trains and every other line: tap a departure in Nearby or a vehicle on the map to see all its stops live.",
  trip_err: "Couldn't load this trip.", then: "then", arrived: "Arrived", zoom_vehicles: "Zoom in to see live vehicles",
  about: "About", lines_title: "Lines", stop_dep: "Departures", geo_err: "Search is unavailable right now. Showing stations from the built-in network.",
 },
 it: {
  good_morning: "Buongiorno", good_afternoon: "Buon pomeriggio", good_evening: "Buonasera", good_night: "Buonanotte", departing: "In partenza qui vicino", see_all_stops: "Tutte le fermate vicine", set: "Imposta", service_alerts: "Avvisi di servizio", prices_auto: "I prezzi vengono letti ogni giorno dai siti ufficiali.", checked_on: "Verificati il {d}",
  tickets: "Biglietti", ticket_prices: "Prezzi dei biglietti", tickets_in: "Biglietti a {c}", from_price: "da {p}", valid_min: "Valido {m} min", fare_other: "Tariffa treno o regionale: verifica con l'operatore", fare_n: "{n} × {t}", prices_checked: "Prezzi ufficiali di {o}, verificati il {d}.", official_site: "Sito ufficiale", no_prices: "Non abbiamo ancora potuto verificare i prezzi per questa città. Consulta il sito dell'operatore.", paper: "{p} su carta",
  home_tab: "Home", stations: "Fermate", nearest: "Fermate più vicine", favourites: "Preferiti", stop_code: "Fermata {c}", walk_min: "{m} min a piedi", all_deps: "Tutte le partenze", scheduled: "Programmato", search_line: "Cerca una linea", alerts: "Avvisi", recent_lines: "Recenti", clear: "Cancella", no_alerts: "Nessun avviso di servizio al momento.", no_fav_stops: "Nessuna fermata preferita. Tocca la stella su una fermata per aggiungerla.", no_fav_lines: "Nessuna linea preferita. Tocca la stella su una linea per aggiungerla.", show_more: "Mostra altre", direction: "Direzione", tap_stop: "Tocca una fermata per vedere quando passa questa linea.", vehicles_now: n => n === 1 ? "1 mezzo in linea ora" : `${n} mezzi in linea ora`, no_lines: "Nessuna linea corrisponde alla ricerca.", loading_lines: "Caricamento linee…", n_alerts: n => n === 1 ? "1 avviso di servizio" : `${n} avvisi di servizio`, add_fav: "Aggiungi ai preferiti", remove_fav: "Rimuovi dai preferiti", lines_at: "Linee", no_live_here: "Nessun passaggio di questa linea nella prossima ora.", city: "Città",
  plan: "Percorso", nearby: "Vicino", where_to: "Dove vuoi andare?", set_home: "Imposta casa", set_work: "Imposta lavoro", save_place: "Salva questa destinazione", saved_places: "Luoghi salvati", remove: "Rimuovi", share: "Condividi", copied: "Copiato", install: "Installa app", install_s: "Aggiungi ItaliaNow alla schermata Home.", sort_by: "Ordina", set_hint: "Cerca un luogo, poi salvalo come Casa o Lavoro dai risultati.", lines: "Linee", saved: "Salvati", more: "Altro",
  from: "Da", to: "A", choose_start: "Scegli partenza", choose_dest: "Scegli destinazione", swap: "Inverti partenza e destinazione",
  now: "Adesso", depart_at: "Parti alle", arrive_by: "Arriva entro", search: "Cerca percorsi", fewest: "Meno cambi", fastest: "Più veloce",
  my_location: "La mia posizione", pick_map: "Scegli sulla mappa", pick_hint: "Tocca la mappa per scegliere un luogo",
  live: "In tempo reale", offline: "Offline", offline_note: "Il calcolo percorsi non è raggiungibile. Percorsi dalla rete metro e tram integrata.",
  min: "min", h: "h", changes: n => n === 0 ? "Diretto" : n === 1 ? "1 cambio" : `${n} cambi`,
  walk: "A piedi", walk_m: "A piedi {d}", stops: n => n === 1 ? "1 fermata" : `${n} fermate`, platform: "Binario", towards: "per",
  on_time: "In orario", late: "+{m} min", early: "−{m} min", cancelled: "Soppresso", est: "≈ orari stimati dalla frequenza",
  every: "ogni {m} min", no_service: "Nessuna partenza a breve", details: "Viaggio", back: "Indietro",
  no_routes: "Nessun percorso", no_routes_s: "Prova un altro orario o luoghi più vicini a una fermata.",
  same_city: "Il calcolo offline funziona in una sola città. Connettiti per viaggiare in tutta Italia.", retry: "Riprova", pick_both: "Scegli partenza e destinazione",
  arrive: "Arrivo", depart: "Partenza", total_walk: "{d} a piedi",
  nearby_title: "Partenze vicine", within: "Fermate entro {r} m", updated: "Aggiornato {t} · ogni {s} s", updating: "Aggiornamento…",
  no_stops: "Nessuna fermata entro {r} m", no_stops_s: "Sposta la mappa e tocca Cerca in questa zona.",
  search_here: "Cerca in questa zona",
  ob_title: "Le partenze intorno a te, in tempo reale", ob_body: "ItaliaNow usa la tua posizione per mostrarti fermate e partenze vicine e come partenza dei viaggi. Resta sul dispositivo e viene inviata solo con le richieste di percorso.",
  ob_allow: "Consenti posizione", ob_skip: "Non ora",
  loc_denied: "Posizione disattivata. Partenze intorno al centro della mappa. Puoi attivarla nelle impostazioni del browser.",
  loc_err: "Posizione non disponibile. Uso il centro della mappa.", locating: "Ricerca della posizione…",
  metro: "Metro", tram: "Tram", rail: "Ferrovia", funicular: "Funicolare",
  first: "Prima", last: "Ultima", stations: "Stazioni", frequency: "Frequenza feriale", branch: "Diramazione",
  station: "Stazione", interchange: "Interscambi", next_dep: "Prossime partenze", walk_to: "{t} min a piedi",
  saved_title: "Salvati", home: "Casa", work: "Lavoro", recent: "Ricerche recenti", no_recent: "Qui compaiono le tue ricerche.",
  set_from_search: "Cerca un luogo in Percorso, poi salvalo.", save_as: "Salva la destinazione come",
  settings: "Impostazioni", language: "Lingua", theme: "Tema", system: "Sistema", light: "Chiaro", dark: "Scuro",
  crash: "Invia segnalazioni di arresto", crash_s: "Segnalazioni anonime tramite Sentry. Disattivate finché non le attivi.",
  sim_off: "Simula offline", sim_off_s: "Usa solo la rete integrata, come senza connessione.",
  privacy: "Informativa privacy", attributions: "Attribuzioni", strikes: "Calendario scioperi",
  strike_today: "Sciopero oggi: servizio solo nelle fasce garantite", strike_soon: "Sciopero {d}", strike_cal: "Calendario ufficiale",
  net_stats: "{l} linee · {s} stazioni", loading: "Ricerca…", estimated: "Stimato",
  place: "Luogo", stop: "Fermata", address: "Indirizzo", ref_day: "Giorno di riferimento orario {d}", license: "Licenza", open_link: "Apri",
  err_title: "Impossibile caricare le partenze", err_body: "Controlla la connessione e riprova.", in_min: "tra {m} min", due: "ora",
  all: "Tutti", bus: "Bus", train: "Treno", ferry: "Traghetto", other: "Altro", trip: "Corsa", live_vehicles: "Mezzi in tempo reale", lines_hint: "Bus, treni e tutte le altre linee: tocca una partenza in Vicino o un mezzo sulla mappa per vedere tutte le fermate in tempo reale.",
  trip_err: "Impossibile caricare questa corsa.", then: "poi", arrived: "Arrivato", zoom_vehicles: "Ingrandisci per vedere i mezzi in tempo reale",
  about: "Informazioni", lines_title: "Linee", stop_dep: "Partenze", geo_err: "Ricerca non disponibile ora. Mostro le stazioni della rete integrata.",
 },
};
const sysLang = (navigator.language || "en").toLowerCase().startsWith("it") ? "it" : "en";
const S = {
  langPref: store.get("lang", "system"), themePref: store.get("theme", "light"),
  crash: store.get("crash", false), simOffline: store.get("simOffline", false),
  tab: "nearby", view: null, params: {}, from: null, to: null, timeMode: "now", timeVal: "", pref: "fastest",
  focus: null, recents: store.get("recents", []), home: store.get("home", null), work: store.get("work", null),
  strikeDismissed: false, linesCity: "rome",
  me: null, locState: "unknown", // unknown | asking | granted | denied | error
  nearby: { center: null, stops: [], loading: false, error: null, updated: null },
  apiDown: false, strike: null, picking: null, planResult: null,
  modeFilter: store.get("modeFilter", "all"), tripRefs: [], vehicles: [],
  stationsTab: "nearby", favStops: store.get("favStops", []), favLines: store.get("favLines", []), recentLines: store.get("recentLines", []),
  lineTab: "all", lineQ: "", linesShown: 60, alerts: new Map(), favData: {}, lineFocus: null,
};
/* transport categories used by filters, colours and icons */
const CATS = ["all", "bus", "metro", "tram", "train", "ferry", "other"];
function modeCat(m) {
  m = String(m || "").toUpperCase();
  if (/BUS|COACH|TROLLEY/.test(m)) return "bus";
  if (/SUBWAY|METRO/.test(m)) return "metro";
  if (/TRAM/.test(m)) return "tram";
  if (/RAIL|SUBURBAN|TRAIN/.test(m)) return "train";
  if (/FERRY/.test(m)) return "ferry";
  return "other";
}
const CAT_COLOR = { bus: "1F6FB2", metro: "0B6B4F", tram: "C2410C", train: "B3261E", ferry: "0E7490", other: "5B6770" };
const passFilter = m => S.modeFilter === "all" || modeCat(m) === S.modeFilter;
const lang = () => S.langPref === "system" ? sysLang : S.langPref;
const t = (k, vars) => { let s = STR[lang()][k] ?? STR.en[k] ?? k; if (typeof s === "function") return s(vars); if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace("{" + a + "}", b); return s; };
const locale = () => lang() === "it" ? "it-IT" : "en-GB";
const fmtTime = d => new Intl.DateTimeFormat(locale(), { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(d);
const fmtDay = d => new Intl.DateTimeFormat(locale(), { weekday: "short", day: "numeric", month: "short", timeZone: TZ }).format(d);
const nf = (n, o) => new Intl.NumberFormat(locale(), o).format(n);
const fmtDur = s => { const m = Math.round(s / 60); if (m < 60) return `${nf(m)} ${t("min")}`; return `${nf(Math.floor(m / 60))} ${t("h")} ${String(m % 60).padStart(2, "0")}`; };
const fmtDist = m => (m = Math.round(m / 10) * 10) < 1000 ? `${nf(m)} m` : `${nf(m / 1000, { maximumFractionDigits: 1 })} km`;
const secOfDay = s => { const h = Math.floor(s / 3600) % 24, m = Math.floor(s % 3600 / 60); return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`; };
function romeParts(d) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(d).map(x => [x.type, x.value]));
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour, mi: +p.minute };
}
function romeToDate(y, mo, d, h, mi) { let g = Date.UTC(y, mo - 1, d, h, mi); for (let i = 0; i < 2; i++) { const p = romeParts(new Date(g)); g -= Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi) - Date.UTC(y, mo - 1, d, h, mi); } return new Date(g); }
const cssVar = n => getComputedStyle(app).getPropertyValue(n).trim();
const isDark = () => S.themePref === "dark" || (S.themePref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);

/* ================= icons ================= */
const I = {
  walk: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="13" cy="4" r="2"/><path d="M13.5 7.5 10 9l-2 4 1.6.8 1.5-2.9 1.1-.4-1.4 6.5-2.8 3.9 1.6 1.2 3-4.1.7-2.3 2 2V22h2v-5.6l-2.3-2.4.6-3.2.8 1.6 2.9 1.6.9-1.8-2.3-1.3-1.6-3.1c-.4-.8-1.3-1.1-2.1-.9z"/></svg>',
  metro: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8 2 5 2.5 5 6v9.5A3.5 3.5 0 0 0 8.5 19L7 20.5v.5h2l2-2h2l2 2h2v-.5L15.5 19a3.5 3.5 0 0 0 3.5-3.5V6c0-3.5-3-4-7-4zM8.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.5-7H7V6h4v4zm4.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm1.5-7h-4V6h4v4z"/></svg>',
  tram: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 5l.75-1.5H17V2H7v1.5h4.75L11 5c-3.13.09-6 .73-6 3.5V17c0 1.5 1.11 2.73 2.55 2.95L6 21.5v.5h2.23l2-2H14l2 2h2v-.5L16.45 20A3 3 0 0 0 19 17V8.5c0-2.77-2.87-3.41-6-3.5zm-1 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5-4.5H7V9h10v5z"/></svg>',
  bus: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm1.5-6H6V6h12v5z"/></svg>',
  rail: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c-4 0-8 .5-8 4v9.5A3.5 3.5 0 0 0 7.5 19L6 20.5v.5h12v-.5L16.5 19a3.5 3.5 0 0 0 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM11 10H6V7h5v3zm2 0V7h5v3h-5zm3.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>',
  funicular: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 20 21 6v3L5 21.5H3V20zm4-9.5 8-6.2c.9-.7 2.2-.1 2.2 1V9l-10 7.8V10.5z"/></svg>',
  ferry: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 21c-1.4 0-2.8-.5-4-1.3-2.4 1.7-5.6 1.7-8 0C6.8 20.5 5.4 21 4 21H2v2h2c1.4 0 2.7-.3 4-1 2.5 1.3 5.5 1.3 8 0 1.3.7 2.6 1 4 1h2v-2h-2zM3.9 19H4c1.6 0 3-.9 4-2 1 1.1 2.4 2 4 2s3-.9 4-2c1 1.1 2.4 2 4 2h.1l1.9-6.7-2-.7V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v5.6l-2 .7L3.9 19zM6 6h12v4l-6-2-6 2V6z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4"/></svg>',
  chev: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
  work: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 7h-4V5l-2-2h-4L8 5v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17.3 18.2 21l-1.6-7L22 9.2l-7.2-.6L12 2 9.2 8.6 2 9.2 7.4 14l-1.6 7z"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>',
  near: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" stroke-dasharray="3 3"/></svg>',
  lines: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 3v18M12 3v6a4 4 0 0 0 4 4h0a4 4 0 0 1 4 4v4"/><circle cx="5" cy="8" r="1.6" fill="currentColor"/><circle cx="5" cy="16" r="1.6" fill="currentColor"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
  off: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M2 8.8a15 15 0 0 1 4.3-2.6M9.8 5.2A15 15 0 0 1 22 8.8M5 12.5a10 10 0 0 1 3.5-2M12.6 9.6A10 10 0 0 1 19 12.5M8.5 16a5 5 0 0 1 7 0M3 3l18 18"/></svg>',
  ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4 10 14M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  loc: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>',
};
const modeIcon = m => ({ WALK: I.walk, SUBWAY: I.metro, METRO: I.metro, metro: I.metro, TRAM: I.tram, tram: I.tram, BUS: I.bus, COACH: I.bus,
  RAIL: I.rail, REGIONAL_RAIL: I.rail, HIGHSPEED_RAIL: I.rail, LONG_DISTANCE: I.rail, NIGHT_RAIL: I.rail, REGIONAL_FAST_RAIL: I.rail, SUBURBAN: I.rail, rail: I.rail,
  FUNICULAR: I.funicular, CABLE_CAR: I.funicular, AERIAL_LIFT: I.funicular, funicular: I.funicular, FERRY: I.ferry }[m] || I.bus);

/* ================= colours / chips ================= */
function lum(hex) { const c = hex.match(/\w\w/g).map(x => parseInt(x, 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; }
function onColor(hex) { const L = lum(hex); return 1.05 / (L + .05) >= (L + .05) / .0675 ? "#FFFFFF" : "#111111"; }
function normColor(c) { c = (c || "").replace("#", "").toUpperCase(); return /^[0-9A-F]{6}$/.test(c) && c !== "FFFFFF" ? c : "5B6770"; }
function chip(name, color, mode, sm) {
  const c = normColor(color); const isMetro = /^(metro|SUBWAY)$/.test(mode); const wide = String(name).length > 2;
  return `<span class="lc ${isMetro ? "metro" : ""} ${isMetro && wide ? "wide" : ""} ${sm ? "sm" : ""}" style="background:#${c};color:${onColor(c)}">${mode && !isMetro && !sm ? modeIcon(mode) : ""}${esc(name)}</span>`;
}
const liveName = n => { const m = /^ME([ABC]1?)$/.exec(n || ""); return m ? m[1] : (n || ""); };
const liveMode = m => m === "SUBWAY" ? "metro" : m;
function titleish(n) { n = String(n || "").replace(/\s*#\s*\w+$/, "").replace(/^[A-Z' ]{3,}\s*\|\s*/, ""); const tc = n === n.toUpperCase() ? n.toLowerCase().replace(/(^|[\s(/'-])\p{L}/gu, m => m.toUpperCase()) : n; return tc.replace(/\(([A-Za-z]{2}(?:\s?-\s?[A-Za-z]{2})*)\)/g, (m, g) => "(" + g.toUpperCase() + ")"); }
function hav(a, b) { const R = 6371000, r = Math.PI / 180; const dLa = (b[0] - a[0]) * r, dLo = (b[1] - a[1]) * r; const h = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); }

/* ================= API client: timeout, retry with backoff, cache, concurrency limit ================= */
const api = (() => {
  const cache = new Map(); let active = 0; const queue = [];
  const slot = () => new Promise(res => { if (active < CFG.MAX_PARALLEL_REQUESTS) { active++; res(); } else queue.push(res); });
  const release = () => { const n = queue.shift(); if (n) n(); else active--; };
  async function get(path, params, { ttl = CFG.CACHE_SECONDS, retries = 2 } = {}) {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== "")).toString();
    const url = `${CFG.API_BASE}${path}?${qs}`;
    const hit = cache.get(url); if (hit && Date.now() - hit.at < ttl * 1000) return hit.data;
    if (S.simOffline || !navigator.onLine) throw new Error("offline");
    await slot();
    try {
      for (let attempt = 0; ; attempt++) {
        const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), CFG.REQUEST_TIMEOUT_MS);
        try {
          // browsers don't allow setting User-Agent; the page's Origin/Referer identifies ItaliaNow to Transitous
          const r = await fetch(url, { signal: ctl.signal, headers: { Accept: "application/json" } });
          clearTimeout(timer);
          if (r.status === 429 || r.status >= 500) throw Object.assign(new Error("http " + r.status), { retry: true });
          if (!r.ok) throw new Error("http " + r.status);
          const data = await r.json(); cache.set(url, { at: Date.now(), data }); S.apiDown = false; return data;
        } catch (e) {
          clearTimeout(timer);
          if (attempt >= retries || !(e.retry || e.name === "AbortError" || e instanceof TypeError)) { S.apiDown = true; throw e; }
          await new Promise(r => setTimeout(r, 600 * 2 ** attempt + Math.random() * 300));
        }
      }
    } finally { release(); renderBadge(); }
  }
  return { get };
})();

/* ================= offline network ================= */
let NET = null, lineById = {}, cityById = {}, stations = {}, transfersAt = {}, runtime = {}, adj = {};
const cityOf = sid => sid.split(":")[0];
const lineName = l => l.code;
const lineTermini = l => { const b = l.branches[0]; return `${stations[b[0]].name} – ${stations[b[b.length - 1]].name}`; };
let FARES = null;
const eur = v => new Intl.NumberFormat(locale(), { style: "currency", currency: "EUR" }).format(v);
async function loadNetwork() {
  fetch("data/fares.json").then(r => r.json()).then(f => { FARES = f; if (S.tab === "home" && !S.view) render(); }).catch(() => {});
  NET = await (await fetch("data/network.json")).json();
  lineById = Object.fromEntries(NET.lines.map(l => [l.id, l])); cityById = Object.fromEntries(NET.cities.map(c => [c.id, c])); stations = NET.stations;
  for (const [a, b, d, w] of NET.transfers) { (transfersAt[a] ||= []).push({ to: b, d, w }); (transfersAt[b] ||= []).push({ to: a, d, w }); }
  for (const l of NET.lines) for (const [a, b, s] of l.runtime) { runtime[l.id + "|" + a + "|" + b] = s; runtime[l.id + "|" + b + "|" + a] = s; }
  for (const l of NET.lines) for (const b of l.branches) for (let i = 0; i + 1 < b.length; i++) { const s = runtime[l.id + "|" + b[i] + "|" + b[i + 1]] ?? 120; (adj[b[i]] ||= []).push({ line: l.id, to: b[i + 1], s }); (adj[b[i + 1]] ||= []).push({ line: l.id, to: b[i], s }); }
}
function bandIdx(sec) { const h = sec / 3600; const B = NET.timeBands; for (let i = 0; i < B.length; i++) if (h >= B[i][0] && h < B[i][1]) return i; return -1; }
function headwayAt(l, sec) {
  if (l.firstDep == null) return null; const s = ((sec % 86400) + 86400) % 86400;
  if (!((s >= l.firstDep - 600 && s <= l.lastDep) || (l.lastDep > 86400 && s + 86400 <= l.lastDep))) return null;
  let i = bandIdx(s); if (i < 0) i = s < 5 * 3600 ? NET.timeBands.length - 1 : 0; return l.headways[i] ?? l.headways.find(x => x) ?? null;
}
class Heap { constructor() { this.a = []; } push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() { const a = this.a, top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } } return top; } get size() { return this.a.length; } }
function placeCity(p) { if (p.sid) return cityOf(p.sid); let best = null, bd = 1e9; for (const c of NET.cities) { const d = hav([p.lat, p.lon], c.center); if (d < bd) { bd = d; best = c.id; } } return bd < 30000 ? best : null; }
function accessStations(place, city) {
  if (place.sid) return [{ sid: place.sid, walk: 0, d: 0 }];
  const out = []; for (const [sid, st] of Object.entries(stations)) { if (cityOf(sid) !== city) continue; const d = hav([place.lat, place.lon], [st.lat, st.lon]); if (d <= 1000) out.push({ sid, walk: Math.round(d * 1.3 / 1.2), d: Math.round(d * 1.3) }); }
  return out.sort((a, b) => a.walk - b.walk).slice(0, 12);
}
function routeOffline(from, to, depSec, pref) {
  const city = placeCity(from); if (!city || city !== placeCity(to)) return { error: "city" };
  const BOARD = pref === "fewest" ? 1500 : 150; const src = accessStations(from, city), dst = accessStations(to, city);
  const dstMap = Object.fromEntries(dst.map(d => [d.sid, d])); const best = {}, prev = {}, h = new Heap();
  for (const s of src) { const k = s.sid + "|"; best[k] = { c: s.walk, t: s.walk, b: 0 }; prev[k] = { kind: "access", walk: s.walk, d: s.d }; h.push([s.walk, k]); }
  let goal = null, goalCost = Infinity;
  while (h.size) {
    const [c, k] = h.pop(); const cur = best[k]; if (!cur || c > cur.c) continue; if (c >= goalCost) break;
    const [sid, line] = k.split("|");
    if (!line && dstMap[sid]) { const gc = c + dstMap[sid].walk; if (gc < goalCost) { goalCost = gc; goal = k; } }
    const relax = (nk, nc, nt, nb, info) => { const o = best[nk]; if (!o || nc < o.c) { best[nk] = { c: nc, t: nt, b: nb }; prev[nk] = { from: k, ...info }; h.push([nc, nk]); } };
    if (!line) {
      const seen = new Set();
      for (const e of adj[sid] || []) { if (seen.has(e.line)) continue; seen.add(e.line); const hw = headwayAt(lineById[e.line], depSec + cur.t); if (!hw) continue; const wait = Math.round(hw * 30) + (cur.b ? 120 : 0); relax(sid + "|" + e.line, c + wait + BOARD, cur.t + wait, cur.b + 1, { kind: "board", line: e.line, wait }); }
      for (const tr of transfersAt[sid] || []) relax(tr.to + "|", c + tr.w, cur.t + tr.w, cur.b, { kind: "walk", walk: tr.w, d: tr.d });
    } else {
      for (const e of adj[sid] || []) if (e.line === line) relax(e.to + "|" + line, c + e.s + 20, cur.t + e.s + 20, cur.b, { kind: "ride", line, s: e.s + 20 });
      relax(sid + "|", c, cur.t, cur.b, { kind: "alight" });
    }
  }
  if (!goal) return { error: "none" };
  const chain = []; let k = goal; while (k) { const p = prev[k]; chain.push({ k, ...p }); k = p.from; } chain.reverse();
  const legs = []; let tc = depSec; const first = chain[0];
  if (first.walk > 0) legs.push({ kind: "walk", from: null, to: first.k.split("|")[0], s: first.walk, d: first.d }); tc += first.walk;
  for (let i = 1; i < chain.length; i++) {
    const st = chain[i], sid = st.k.split("|")[0];
    if (st.kind === "board") { tc += st.wait; legs.push({ kind: "ride", line: st.line, from: sid, to: sid, stops: [], dep: tc, s: 0 }); }
    else if (st.kind === "ride") { const L = legs[legs.length - 1]; L.stops.push(sid); L.to = sid; L.s += st.s; tc += st.s; L.arr = tc; }
    else if (st.kind === "walk") { legs.push({ kind: "walk", from: chain[i - 1].k.split("|")[0], to: sid, s: st.walk, d: st.d }); tc += st.walk; }
  }
  const last = dstMap[goal.split("|")[0]]; if (last.walk > 0) { legs.push({ kind: "walk", from: goal.split("|")[0], to: null, s: last.walk, d: last.d }); tc += last.walk; }
  const merged = []; for (const L of legs) { const P = merged[merged.length - 1]; if (P && P.kind === "walk" && L.kind === "walk") { P.to = L.to; P.s += L.s; P.d += L.d; } else merged.push(L); }
  return { legs: merged, dep: depSec, arr: tc, dur: tc - depSec, transfers: Math.max(0, merged.filter(l => l.kind === "ride").length - 1), walk: merged.filter(l => l.kind === "walk").reduce((a, l) => a + l.d, 0) };
}
function offlinePlans(from, to, depSec, arriveBy) {
  const out = [];
  for (const pref of S.pref === "fewest" ? ["fewest", "fastest"] : ["fastest", "fewest"]) {
    const r = routeOffline(from, to, depSec, pref); if (r.error) return r;
    const sig = r.legs.filter(l => l.kind === "ride").map(l => l.line).join(","); if (!out.some(o => o.sig === sig)) out.push({ ...r, sig, pref });
  }
  if (arriveBy) for (const o of out) { const sh = depSec - o.arr; o.dep += sh; o.arr += sh; for (const l of o.legs) { if (l.dep != null) l.dep += sh; if (l.arr != null) l.arr += sh; } }
  return out;
}

/* ================= map (MapLibre GL) ================= */
const styleUrl = () => CFG.MAPTILER_KEY
  ? `https://api.maptiler.com/maps/${isDark() ? "dataviz-dark" : "streets-v2"}/style.json?key=${CFG.MAPTILER_KEY}`
  : (isDark() ? CFG.STYLE_DARK : CFG.STYLE_LIGHT);
let map, mapReady = false, markers = [], currentStyle = "";
const emptyFC = { type: "FeatureCollection", features: [] };
const overlay = { journey: emptyFC, focus: emptyFC, dim: false };
function networkFC() {
  return { type: "FeatureCollection", features: NET.lines.map(l => ({ type: "Feature", properties: { color: "#" + l.color, mode: l.mode, id: l.id },
    geometry: { type: "MultiLineString", coordinates: (l.shape && l.shape.length > 1 ? [l.shape] : l.branches.map(b => b.map(s => [stations[s].lat, stations[s].lon]))).map(line => line.map(([la, lo]) => [lo, la])) } })) };
}
function addLayers() {
  if (map.getSource("network")) return;
  map.addSource("network", { type: "geojson", data: networkFC() });
  map.addSource("focus", { type: "geojson", data: overlay.focus });
  map.addSource("journey", { type: "geojson", data: overlay.journey });
  map.addLayer({ id: "net-tram", type: "line", source: "network", filter: ["==", ["get", "mode"], "tram"], minzoom: 11, paint: { "line-color": ["get", "color"], "line-width": 2, "line-opacity": 0.55 }, layout: { "line-cap": "round", "line-join": "round" } });
  map.addLayer({ id: "net-main", type: "line", source: "network", filter: ["!=", ["get", "mode"], "tram"], paint: { "line-color": ["get", "color"], "line-width": ["interpolate", ["linear"], ["zoom"], 9, 2, 14, 5], "line-opacity": 0.9 }, layout: { "line-cap": "round", "line-join": "round" } });
  map.addLayer({ id: "focus-casing", type: "line", source: "focus", paint: { "line-color": isDark() ? "#000" : "#fff", "line-width": 10 }, layout: { "line-cap": "round", "line-join": "round" } });
  map.addLayer({ id: "focus-line", type: "line", source: "focus", paint: { "line-color": ["get", "color"], "line-width": 6 }, layout: { "line-cap": "round", "line-join": "round" } });
  map.addLayer({ id: "j-casing", type: "line", source: "journey", filter: ["!=", ["get", "walk"], true], paint: { "line-color": isDark() ? "#000" : "#fff", "line-width": 10 }, layout: { "line-cap": "round", "line-join": "round" } });
  map.addLayer({ id: "j-line", type: "line", source: "journey", filter: ["!=", ["get", "walk"], true], paint: { "line-color": ["get", "color"], "line-width": 6 }, layout: { "line-cap": "round", "line-join": "round" } });
  map.addLayer({ id: "j-walk", type: "line", source: "journey", filter: ["==", ["get", "walk"], true], paint: { "line-color": isDark() ? "#cfd8d3" : "#46544d", "line-width": 3.5, "line-dasharray": [0.5, 2] }, layout: { "line-cap": "round" } });
  // live vehicles (every mode), drawn above the network
  map.addSource("vehicles", { type: "geojson", data: emptyFC });
  map.addLayer({ id: "veh", type: "circle", source: "vehicles", paint: {
    "circle-color": ["get", "color"], "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 3.5, 14, 6.5, 17, 9],
    "circle-stroke-color": isDark() ? "#0B0F0D" : "#FFFFFF", "circle-stroke-width": 2 } });
  if (map.getStyle().glyphs) map.addLayer({ id: "veh-label", type: "symbol", source: "vehicles", minzoom: 14,
    layout: { "text-field": ["get", "name"], "text-size": 11, "text-offset": [0, -1.3], "text-allow-overlap": false, "text-font": ["Open Sans Bold", "Noto Sans Bold", "Montserrat Bold"] },
    paint: { "text-color": isDark() ? "#E4EBE7" : "#16201B", "text-halo-color": isDark() ? "#0B0F0D" : "#FFFFFF", "text-halo-width": 1.5 } });
  applyVehicleFilter();
  applyDim();
}
function applyVehicleFilter() { if (!mapReady || !map.getLayer("veh")) return; const f = S.modeFilter === "all" ? null : ["==", ["get", "cat"], S.modeFilter]; map.setFilter("veh", f); if (map.getLayer("veh-label")) map.setFilter("veh-label", f); }

/* live vehicle positions: fetched for the visible area every 30 s, moved smoothly every second */
let vehTimer = null, vehAnim = null, vehDebounce = null;
async function loadVehicles() {
  if (!mapReady || S.simOffline) return;
  if (map.getZoom() < 12) { S.vehicles = []; drawVehicles(); return; }
  const b = map.getBounds(); const now = new Date();
  try {
    const segs = await api.get("/api/v1/map/trips", { min: `${b.getSouth()},${b.getWest()}`, max: `${b.getNorth()},${b.getEast()}`,
      startTime: now.toISOString(), endTime: new Date(+now + 90000).toISOString(), zoom: Math.round(map.getZoom()) }, { ttl: 20, retries: 1 });
    S.vehicles = segs.map(s => {
      const pts = s.polyline ? decode(s.polyline, 5) : [[s.from.lat, s.from.lon], [s.to.lat, s.to.lon]];
      const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + hav(pts[i - 1], pts[i]));
      const tr = s.trips?.[0] || {};
      return { pts, cum, dep: +new Date(s.departure), arr: +new Date(s.arrival), mode: s.mode, cat: modeCat(s.mode), color: "#" + liveColor(s.routeColor, s.mode),
        name: liveName(tr.routeShortName || ""), tripId: tr.tripId, rawColor: liveColor(s.routeColor, s.mode) };
    });
  } catch { /* keep the last positions; the badge shows offline */ }
  drawVehicles();
}
function vehiclePos(v, now) {
  const f = Math.max(0, Math.min(1, (now - v.dep) / Math.max(1, v.arr - v.dep))); const target = f * v.cum[v.cum.length - 1];
  let i = 1; while (i < v.cum.length - 1 && v.cum[i] < target) i++;
  const seg = v.cum[i] - v.cum[i - 1] || 1, k = (target - v.cum[i - 1]) / seg;
  const a = v.pts[i - 1], b = v.pts[i] || a; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
}
function drawVehicles() {
  if (!mapReady || !map.getSource("vehicles")) return;
  const now = Date.now(); const seen = new Set(); const feats = [];
  for (const v of S.vehicles) {
    if (now > v.arr + 30000 || now < v.dep - 60000) continue;
    if (S.lineFocus && (v.name !== S.lineFocus.name || v.cat !== S.lineFocus.cat)) continue;
    if (v.tripId) { if (seen.has(v.tripId)) continue; seen.add(v.tripId); }
    const [la, lo] = vehiclePos(v, now);
    feats.push({ type: "Feature", properties: { color: v.color, cat: v.cat, name: v.name, tripId: v.tripId || "", mode: v.mode, rawColor: v.rawColor }, geometry: { type: "Point", coordinates: [lo, la] } });
  }
  map.getSource("vehicles").setData({ type: "FeatureCollection", features: feats });
  updateVehCount();
}
function startVehicles() {
  clearInterval(vehTimer); clearInterval(vehAnim);
  loadVehicles();
  vehTimer = setInterval(() => { if (document.visibilityState === "visible") loadVehicles(); }, CFG.REFRESH_SECONDS * 1000);
  vehAnim = setInterval(() => { if (document.visibilityState === "visible") drawVehicles(); }, 1000);
}
function applyDim() { if (!mapReady) return; const d = overlay.dim; map.setPaintProperty("net-main", "line-opacity", d ? 0.18 : 0.9); map.setPaintProperty("net-tram", "line-opacity", d ? 0.12 : 0.55); }
function initMap() {
  currentStyle = styleUrl();
  map = new maplibregl.Map({ container: "map", style: currentStyle, center: [CFG.DEFAULT_CENTER[1], CFG.DEFAULT_CENTER[0]], zoom: 14, attributionControl: false, pitchWithRotate: false, dragRotate: false });
  map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: '<a href="https://transitous.org" target="_blank" rel="noopener">Transitous</a> · GTFS: ATAC, ATM, ANM, GTT, AMT, FCE' }), "bottom-right");
  map.touchZoomRotate.disableRotation();
  if (window.ITALIANOW_DEBUG) window.__map = map;
  map.on("style.load", () => { mapReady = true; addLayers(); setJourney(overlay.journey); setFocus(overlay.focus); });
  // if the tile provider is unreachable, keep a plain ground so the transit network and journeys still show
  map.on("error", e => {
    if (mapReady || currentStyle === "fallback" || !/style|AJAX/i.test(String(e.error?.message || ""))) return;
    currentStyle = "fallback";
    map.setStyle({ version: 8, sources: {}, layers: [{ id: "bg", type: "background", paint: { "background-color": cssVar("--map-bg") || "#EDF1EC" } }] });
  });
  map.on("click", e => {
    if (S.picking) { const tgt = S.picking; S.picking = null; S[tgt] = { kind: "address", name: `${nf(e.lngLat.lat, { maximumFractionDigits: 5 })}, ${nf(e.lngLat.lng, { maximumFractionDigits: 5 })}`, lat: e.lngLat.lat, lon: e.lngLat.lng }; setSnap(1); go("plan"); }
  });
  map.once("idle", startVehicles);
  map.on("moveend", () => { clearTimeout(vehDebounce); vehDebounce = setTimeout(loadVehicles, 700); });
  map.on("click", "veh", e => {
    const p = e.features?.[0]?.properties; if (!p || !p.tripId) return;
    S.prev = { tab: S.tab, view: S.view, params: S.params };
    go(S.tab, "trip", { ref: { tripId: p.tripId, name: p.name, color: p.rawColor, mode: p.mode }, back: "trip-back" });
  });
  map.on("mouseenter", "veh", () => { map.getCanvas().style.cursor = "pointer"; });
  map.on("mouseleave", "veh", () => { map.getCanvas().style.cursor = ""; });
  map.on("moveend", e => { if (["nearby", "home"].includes(S.tab) && !S.view && e.originalEvent && S.nearby.center && hav([map.getCenter().lat, map.getCenter().lng], S.nearby.center) > 300) { const b = $("#hereBtn"); b.innerHTML = I.search + esc(t("search_here")); b.hidden = false; } });
}
function refreshMapStyle() { if (!map) return; const s = styleUrl(); if (s !== currentStyle) { currentStyle = s; mapReady = false; map.setStyle(s); } }
function setJourney(fc) { overlay.journey = fc; overlay.dim = fc.features.length > 0 || overlay.focus.features.length > 0; if (mapReady) { map.getSource("journey").setData(fc); applyDim(); } }
function setFocus(fc) { overlay.focus = fc; overlay.dim = fc.features.length > 0 || overlay.journey.features.length > 0; if (mapReady) { map.getSource("focus").setData(fc); applyDim(); } }
function clearMarkers() { for (const m of markers) m.remove(); markers = []; }
function addMarker(lat, lon, cls, html, onClick, label) {
  const el = document.createElement(onClick ? "button" : "div"); el.className = cls; el.innerHTML = html || "";
  if (label) el.setAttribute("aria-label", label); if (onClick) el.addEventListener("click", ev => { ev.stopPropagation(); onClick(); });
  const m = new maplibregl.Marker({ element: el }).setLngLat([lon, lat]).addTo(map); markers.push(m); return el;
}
function mapPadding() {
  if (innerWidth >= 900) return { top: 90, bottom: 40, left: 440, right: 40 };
  return { top: 110, bottom: Math.min(Math.round(sheetH()) + 20, app.clientHeight - 200), left: 30, right: 30 };
}
function fit(points, maxZoom = 16) {
  if (!map || !points.length) return;
  const b = new maplibregl.LngLatBounds(); for (const [la, lo] of points) b.extend([lo, la]);
  map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 }); // MapLibre keeps padding from earlier moves and adds it to the new one
  map.fitBounds(b, { padding: mapPadding(), maxZoom, duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 600 });
}
function flyTo(lat, lon, zoom = 15.5) { map?.easeTo({ center: [lon, lat], zoom, padding: mapPadding(), duration: 600 }); }

/* ================= sheet ================= */
const sheet = $("#sheet"), grab = $("#grab");
// The panel's height is the visible height, so its list can always scroll to the very end.
let snap = 1;
const NAV_H = () => $("#nav").offsetHeight || 64;
function snapHeights() { const H = app.clientHeight; return [Math.round(H * 0.34), Math.round(H * 0.6), H - 72]; }
const sheetH = () => sheet.getBoundingClientRect().height;
function setSnap(i) { snap = Math.max(0, Math.min(2, i)); if (innerWidth >= 900) { sheet.style.height = ""; return; } sheet.style.height = snapHeights()[snap] + "px"; }
(() => { let y0 = null, h0 = 0, moved = false;
  grab.addEventListener("pointerdown", e => { grab.setPointerCapture(e.pointerId); y0 = e.clientY; h0 = sheetH(); moved = false; sheet.classList.add("dragging"); });
  grab.addEventListener("pointermove", e => { if (y0 == null) return; if (Math.abs(e.clientY - y0) > 4) moved = true; const hs = snapHeights(); sheet.style.height = Math.max(hs[0] - 40, Math.min(hs[2], h0 - (e.clientY - y0))) + "px"; });
  const end = () => { if (y0 == null) return; sheet.classList.remove("dragging"); y0 = null;
    if (!moved) return setSnap(snap === 2 ? 1 : snap + 1);
    const h = sheetH(); const hs = snapHeights(); let bi = 0; hs.forEach((v, i) => { if (Math.abs(v - h) < Math.abs(hs[bi] - h)) bi = i; }); setSnap(bi); };
  grab.addEventListener("pointerup", end); grab.addEventListener("pointercancel", end);
  grab.addEventListener("keydown", e => { if (e.key === "ArrowUp") setSnap(snap + 1); if (e.key === "ArrowDown") setSnap(snap - 1); if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSnap(snap === 2 ? 1 : snap + 1); } });
  new ResizeObserver(() => setSnap(snap)).observe(app);
})();

/* ================= chrome ================= */
const isOffline = () => S.simOffline || !navigator.onLine || S.apiDown;
function renderBadge() {
  $("#netBadge").innerHTML = isOffline()
    ? `<span class="badge off" role="status"><span class="dot"></span>${t("offline")}</span>`
    : `<span class="badge live" role="status"><span class="dot"></span>${t("live")}</span>`;
}
function noteAlerts(alerts, line) {
  for (const a of alerts || []) { const h = (a.headerText || "").trim(); if (!h) continue; const k = h + "|" + (a.descriptionText || "").slice(0, 60); const e = S.alerts.get(k) || { h, d: a.descriptionText || "", cause: a.cause, effect: a.effect, lines: new Set(), start: a.impactPeriod?.[0]?.start, end: a.impactPeriod?.[0]?.end }; if (line) e.lines.add(line); S.alerts.set(k, e); }
  for (const a of alerts || []) if (a.cause === "STRIKE") { const st = a.impactPeriod?.[0]?.start; if (st && (!S.strike || new Date(st) < new Date(S.strike.start))) { S.strike = { h: a.headerText, start: st, end: a.impactPeriod[0].end }; renderStrike(); } }
}
function renderStrike() {
  const st = S.strike; let html = "";
  if (st && !S.strikeDismissed) {
    const day = new Date(st.start), now = new Date(); const pd = romeParts(day), pn = romeParts(now);
    const diff = (Date.UTC(pd.y, pd.mo - 1, pd.d) - Date.UTC(pn.y, pn.mo - 1, pn.d)) / 864e5;
    if (diff >= 0 && diff <= 1) html = `<div class="strike compact" role="alert">${I.warn}<a href="https://scioperi.mit.gov.it/mit2/public/scioperi" target="_blank" rel="noopener" title="${esc(st.h || "")}"><b>${esc(diff === 0 ? t("strike_today") : t("strike_soon", { d: fmtDay(day) }))}</b></a><button aria-label="Close" data-act="dismiss-strike">×</button></div>`;
  }
  $("#strikeSlot").innerHTML = html;
}
function renderNav() {
  const tabs = [["home", I.route, "home_tab"], ["nearby", I.loc, "stations"], ["lines", I.lines, "lines"], ["more", I.more, "more"]];
  const cur = S.tab === "plan" ? "home" : S.tab;
  $("#nav").innerHTML = tabs.map(([k, ic, l]) => `<button data-tab="${k}" ${cur === k ? 'aria-current="page"' : ""}><i>${ic}</i>${t(l)}</button>`).join("");
}
addEventListener("online", () => { S.apiDown = false; renderBadge(); if (["nearby", "home"].includes(S.tab)) loadNearby(); });
addEventListener("offline", renderBadge);

/* ================= location ================= */
function getLocation() {
  return new Promise(resolve => {
    if (!navigator.geolocation) { S.locState = "error"; return resolve(null); }
    S.locState = "asking"; let done = false;
    const finish = v => { if (!done) { done = true; clearTimeout(timer); resolve(v); } };
    // if the prompt is ignored or no fix arrives, carry on instead of waiting forever
    const timer = setTimeout(() => { if (!done) { S.locState = "error"; finish(null); } }, 15000);
    navigator.geolocation.getCurrentPosition(
      p => { S.locState = "granted"; S.me = [p.coords.latitude, p.coords.longitude]; finish(S.me); },
      e => { S.locState = e.code === 1 ? "denied" : "error"; finish(null); },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
  });
}
let watchId = null;
function watchLocation() {
  if (!navigator.geolocation || watchId != null) return;
  watchId = navigator.geolocation.watchPosition(p => { S.me = [p.coords.latitude, p.coords.longitude]; if (meMarker) meMarker.setLngLat([S.me[1], S.me[0]]); }, () => {}, { enableHighAccuracy: true, maximumAge: 15000 });
}
let meMarker = null;
function showMe() {
  if (!S.me || !map) return;
  if (!meMarker) { const el = document.createElement("div"); el.className = "mk-me"; el.setAttribute("aria-label", t("my_location")); meMarker = new maplibregl.Marker({ element: el }).setLngLat([S.me[1], S.me[0]]).addTo(map); }
  else meMarker.setLngLat([S.me[1], S.me[0]]);
}
function showOnboarding() {
  $("#overlay").innerHTML = `<div class="onboard" role="dialog" aria-modal="true" aria-labelledby="obT">
    <div class="langs seg" role="group" aria-label="${t("language")}"><button data-ob-lang="en" aria-pressed="${lang() === "en"}">EN</button><button data-ob-lang="it" aria-pressed="${lang() === "it"}">IT</button></div>
    <div class="hero">${I.loc}</div><h1 id="obT">${t("ob_title")}</h1><p>${t("ob_body")}</p>
    <div class="acts"><button class="btn" data-act="ob-allow">${I.near}${t("ob_allow")}</button><button class="btn text" data-act="ob-skip">${t("ob_skip")}</button></div>
    <p class="small muted" style="margin-top:8px"><a href="#" data-act="ob-privacy">${t("privacy")}</a></p></div>`;
  $("[data-act=ob-allow]").focus();
}
async function startWithLocation(ask) {
  $("#overlay").innerHTML = "";
  if (ask) { S.nearby.loading = true; go("home"); const pos = await getLocation(); if (pos) { showMe(); watchLocation(); } }
  const c = S.me || CFG.DEFAULT_CENTER; flyTo(c[0], c[1], 16); loadNearby(c);
}

/* ================= nearby (live) ================= */
let refreshTimer = null, nearbyReq = 0;
function stopRefresh() { clearInterval(refreshTimer); refreshTimer = null; }
function startRefresh() { stopRefresh(); refreshTimer = setInterval(() => { if (document.visibilityState !== "visible") return; if (S.view === "trip") return render(); if (!["nearby", "home"].includes(S.tab)) return; if (S.tab === "nearby" && S.stationsTab === "fav" && !S.view) return loadFavourites(true); loadNearby(S.nearby.center, true); }, CFG.REFRESH_SECONDS * 1000); }
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && ["nearby", "home"].includes(S.tab) && S.nearby.updated && Date.now() - S.nearby.updated > CFG.REFRESH_SECONDS * 1000) loadNearby(S.nearby.center, true); });
async function loadNearby(center = S.nearby.center || S.me || CFG.DEFAULT_CENTER, silent = false) {
  const id = ++nearbyReq; S.nearby.center = center; S.nearby.loading = true; S.nearby.error = null; $("#hereBtn").hidden = true;
  if (!silent && ["nearby", "home"].includes(S.tab) && !S.view) render(); else updateRefreshLine();
  const R = CFG.NEARBY_RADIUS_M, dLa = R / 111320, dLo = R / (111320 * Math.cos(center[0] * Math.PI / 180));
  try {
    const raw = await api.get("/api/v1/map/stops", { min: `${center[0] - dLa},${center[1] - dLo}`, max: `${center[0] + dLa},${center[1] + dLo}` }, { ttl: 300 });
    // one entry per station: group by parent, else by name
    const groups = new Map();
    for (const s of raw) { const d = hav(center, [s.lat, s.lon]); if (d > R) continue; const key = s.parentId || titleish(s.name).toLowerCase(); const g = groups.get(key); if (!g || d < g.distance) groups.set(key, { ...s, distance: d, key }); }
    // nearest stops first, but always keep the nearest stop of every transport type (bus, metro, tram, train, ferry)
    const sorted = [...groups.values()].sort((a, b) => a.distance - b.distance);
    const picked = [];
    for (const c of CATS.slice(1)) { const s = sorted.find(x => (x.modes || []).some(m => modeCat(m) === c)); if (s && !picked.includes(s)) picked.push(s); }
    for (const s of sorted) { if (picked.length >= 12) break; if (!picked.includes(s)) picked.push(s); }
    picked.sort((a, b) => a.distance - b.distance);
    const results = await Promise.all(picked.map(async s => {
      try { const r = await api.get("/api/v1/stoptimes", { stopId: s.parentId || s.stopId, n: 14 }, { ttl: CFG.CACHE_SECONDS }); for (const x of r.stopTimes || []) noteAlerts(x.place?.alerts, liveName(x.displayName || x.routeShortName)); return { ...s, times: r.stopTimes || [] }; }
      catch { return { ...s, times: null }; }
    }));
    if (id !== nearbyReq) return;
    if (results.length && results.every(r => r.times === null)) throw new Error("all failed");
    for (let a = 0; a < results.length; a++) for (let b = results.length - 1; b > a; b--) {
      const A = results[a], B = results[b];
      if (norm(titleish(A.name)) === norm(titleish(B.name)) && hav([A.lat, A.lon], [B.lat, B.lon]) < 300) {
        const seen = new Set((A.times || []).map(x => x.tripId + x.place.departure));
        A.times = [...(A.times || []), ...(B.times || []).filter(x => !seen.has(x.tripId + x.place.departure))].sort((x, y) => new Date(x.place.departure || x.place.arrival) - new Date(y.place.departure || y.place.arrival));
        A.modes = [...new Set([...(A.modes || []), ...(B.modes || [])])]; results.splice(b, 1);
      }
    }
    S.nearby.stops = results; S.nearby.updated = Date.now(); S.nearby.error = null;
  } catch (e) { if (id !== nearbyReq) return; S.nearby.error = e.message || "error"; }
  S.nearby.loading = false;
  if (["nearby", "home"].includes(S.tab) && !S.view && !(S.tab === "nearby" && S.stationsTab === "fav")) { const sc = body.scrollTop, car = $("#carousel")?.scrollLeft; render(); body.scrollTop = sc; if (car && $("#carousel")) $("#carousel").scrollLeft = car; }
  startRefresh();
}
function updateRefreshLine() { const el = $("#refreshLine"); if (!el) return; if (el.classList.contains("livepill")) { el.classList.toggle("busy", S.nearby.loading); return; } el.innerHTML = refreshLine(); }
function refreshLine() {
  const n = S.nearby; return `<span class="ring ${n.loading ? "spin" : ""}" aria-hidden="true"></span>${n.loading && !n.updated ? t("updating") : n.updated ? t("updated", { t: fmtTime(new Date(n.updated)), s: CFG.REFRESH_SECONDS }) : ""}`;
}
function minutesUntil(iso) { return Math.round((new Date(iso) - Date.now()) / 60000); }
function depTimeHtml(x) {
  const p = x.place || x; const dep = p.departure || p.arrival, sd = p.scheduledDeparture || p.scheduledArrival;
  const m = minutesUntil(dep); const cancelled = p.cancelled || x.cancelled;
  const rt = x.realTime ? `<span class="rtw" title="${t("live")}">${liveIcon}</span>` : "";
  const big = m <= 0 ? `<span class="minutes ${x.realTime ? "is-rt" : ""}">${rt}${t("due")}</span>` : m < 60 ? `<span class="minutes tnum ${x.realTime ? "is-rt" : ""}">${rt}${nf(m)}<small>${t("min")}</small></span>` : `<span class="minutes tnum">${fmtTime(new Date(dep))}</span>`;
  const shifted = x.realTime && Math.abs(new Date(dep) - new Date(sd)) >= 60000;
  return `<div class="tm tnum">${big}<span class="small muted">${fmtTime(new Date(dep))}${shifted ? ` <s>${fmtTime(new Date(sd))}</s>` : ""}</span>${delayBadge(sd, dep, x.realTime, cancelled)}</div>`;
}
function delayBadge(sched, actual, rt, cancelled) {
  if (cancelled) return `<span class="delay cx">${t("cancelled")}</span>`; if (!rt) return "";
  const m = Math.round((new Date(actual) - new Date(sched)) / 60000);
  if (m >= 1) return `<span class="delay late">${t("late", { m: nf(m) })}</span>`;
  if (m <= -1) return `<span class="delay ontime">${t("early", { m: nf(-m) })}</span>`;
  return `<span class="delay ontime">${t("on_time")}</span>`;
}
const liveColor = (c, mode) => /^[0-9A-Fa-f]{6}$/.test(c || "") && c.toUpperCase() !== "FFFFFF" ? c : CAT_COLOR[modeCat(mode)];
const tripRef = x => { S.tripRefs.push({ tripId: x.tripId, name: liveName(x.displayName || x.routeShortName || x.tripShortName), color: liveColor(x.routeColor, x.mode), mode: x.mode }); return S.tripRefs.length - 1; };
function depRow(x) {
  const p = x.place || {}; const cancelled = p.cancelled || x.cancelled;
  return `<button class="dep deprow ${cancelled ? "cancelled" : ""}" data-trip="${tripRef(x)}">${chip(liveName(x.displayName || x.routeShortName || x.tripShortName), liveColor(x.routeColor, x.mode), liveMode(x.mode))}<div class="hd">${esc(titleish(x.headsign || x.tripTo?.name || ""))}<small>${esc(x.agencyName || "")}${p.track ? ` · ${t("platform")} ${esc(p.track)}` : ""}</small></div>${depTimeHtml(x)}</button>`;
}
/* Moovit-style: one row per line + direction, with the next departures after it */
function depGroups(times) {
  const g = new Map();
  for (const x of times) {
    if (!passFilter(x.mode)) continue;
    if (minutesUntil(x.place.departure || x.place.arrival) < -1) continue;
    const k = (x.displayName || x.routeShortName || x.tripShortName) + "|" + (x.headsign || "");
    if (!g.has(k)) g.set(k, []); g.get(k).push(x);
  }
  return [...g.values()];
}
function groupRow(list) {
  const x = list[0]; const later = list.slice(1, 3).map(y => { const m = minutesUntil(y.place.departure || y.place.arrival); return m < 60 ? nf(Math.max(0, m)) : fmtTime(new Date(y.place.departure)); });
  const p = x.place || {}; const cancelled = p.cancelled || x.cancelled;
  return `<button class="dep deprow ${cancelled ? "cancelled" : ""}" data-trip="${tripRef(x)}">${chip(liveName(x.displayName || x.routeShortName || x.tripShortName), liveColor(x.routeColor, x.mode), liveMode(x.mode))}<div class="hd">${esc(titleish(x.headsign || ""))}<small>${esc(x.agencyName || "")}${p.track ? ` · ${t("platform")} ${esc(p.track)}` : ""}${later.length ? ` · ${t("then")} ${later.join(", ")} ${t("min")}` : ""}</small></div>${depTimeHtml(x)}</button>`;
}
function modeChips(available) {
  const cats = CATS.filter(c => c === "all" || available.has(c));
  return `<div class="chips" role="group" aria-label="Filter">${cats.map(c => `<button class="chip" data-mode="${c}" aria-pressed="${S.modeFilter === c}">${c === "all" ? "" : modeIcon({ bus: "BUS", metro: "SUBWAY", tram: "TRAM", train: "RAIL", ferry: "FERRY", other: "FUNICULAR" }[c])}${t(c)}</button>`).join("")}</div>`;
}
const CAT_ICON = { bus: "BUS", metro: "SUBWAY", tram: "TRAM", train: "RAIL", ferry: "FERRY", other: "FUNICULAR" };
const stopKey = s => s.parentId || s.stopId;
const isFavStop = s => S.favStops.some(f => f.id === stopKey(s));
const starIcon = on => `<svg width="20" height="20" viewBox="0 0 24 24" ${on ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"'} aria-hidden="true"><path d="M12 17.3 18.2 21l-1.6-7L22 9.2l-7.2-.6L12 2 9.2 8.6 2 9.2 7.4 14l-1.6 7z"/></svg>`;
const liveIcon = '<svg class="rt" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M5 19a1 1 0 1 0 0-.01M5 12a7 7 0 0 1 7 7M5 5a14 14 0 0 1 14 14"/></svg>';
let stopSrc = []; // stops shown on the current screen, referenced by data-i
/* one stop as a card: name, stop code, walking time, lines served, next departures grouped by line */
function stopCard(s, maxRows = 5) {
  const i = stopSrc.push(s) - 1;
  const cats = [...new Set((s.modes || []).map(modeCat))];
  const lineNames = [...new Map((s.times || []).map(x => [liveName(x.displayName || x.routeShortName), x])).values()];
  const groups = s.times ? depGroups(s.times) : [];
  const walk = s.distance != null ? Math.max(1, Math.round(s.distance * 1.3 / 80)) : null;
  const sub = [s.stopCode ? t("stop_code", { c: esc(s.stopCode) }) : "", walk ? t("walk_min", { m: nf(walk) }) : ""].filter(Boolean).join(" · ");
  return `<div class="stop-card">
    <div class="stop-head2"><span class="sq" style="background:#${CAT_COLOR[cats[0] || "bus"]}">${modeIcon(CAT_ICON[cats[0] || "bus"])}</span>
      <button class="sh-main" data-act="open-stop" data-i="${i}"><b>${esc(titleish(s.name))}</b>${sub ? `<small>${sub}</small>` : ""}</button>
      <button class="iconbtn star ${isFavStop(s) ? "on" : ""}" data-act="fav-stop" data-i="${i}" aria-label="${t(isFavStop(s) ? "remove_fav" : "add_fav")}" aria-pressed="${isFavStop(s)}">${starIcon(isFavStop(s))}</button></div>
    ${lineNames.length ? `<div class="served">${lineNames.slice(0, 8).map(x => chip(liveName(x.displayName || x.routeShortName), liveColor(x.routeColor, x.mode), liveMode(x.mode), true)).join("")}${lineNames.length > 8 ? `<span class="more-n">+${lineNames.length - 8}</span>` : ""}</div>` : ""}
    ${s.times === null ? `<div class="dep"><span></span><div class="hd muted">${t("err_title")}</div><span></span></div>` : groups.length ? groups.slice(0, maxRows).map(groupRow).join("") : `<div class="dep"><span></span><div class="hd muted">${t("no_service")}</div><span></span></div>`}
    <button class="viewall" data-act="open-stop" data-i="${i}">${t("all_deps")}</button></div>`;
}
function nearbyStatus() {
  let html = "";
  if (S.locState === "denied") html += `<div class="alert" role="status">${I.near}<span>${t("loc_denied")}</span></div>`;
  else if (S.locState === "error") html += `<div class="alert" role="status">${I.near}<span>${t("loc_err")}</span></div>`;
  else if (S.locState === "asking") html += `<div class="snap">${I.near}${t("locating")}</div>`;
  return html;
}
function nearbyState(n, R) { // loading / error / empty, or "" when there are stops to show
  if (n.error && !n.stops.length) return `<div class="err">${I.off.replace("<svg", '<svg width="40" height="40"')}<b>${t("err_title")}</b><span>${t("err_body")}</span><button class="btn tonal" data-act="nearby-retry">${t("retry")}</button></div>` + (NET ? nearbyOffline(n.center || CFG.DEFAULT_CENTER) : "");
  if (n.loading && !n.stops.length) return `<div class="list" aria-busy="true"><div class="skel"></div><div class="skel"></div></div>`;
  if (!n.stops.length) return `<div class="empty">${I.near}<b>${t("no_stops", { r: R })}</b>${t("no_stops_s")}</div>`;
  return "";
}
function stopMarkers(list) {
  list.forEach(s => { const m = (s.modes || [])[0]; if (S.modeFilter !== "all" && !(s.modes || []).some(x => modeCat(x) === S.modeFilter)) return;
    const mk = addMarker(s.lat, s.lon, "mk-stop", modeIcon(m), () => { stopSrc = [s]; go(S.tab === "home" ? "home" : "nearby", "stop", { s }); }, titleish(s.name)); mk.style.background = "#" + CAT_COLOR[modeCat(m)]; });
}
/* HOME: one clear search, four shortcuts, and the next departures around you */
function greeting() { const h = romeParts(new Date()).h; return t(h < 5 ? "good_night" : h < 12 ? "good_morning" : h < 18 ? "good_afternoon" : "good_evening"); }
function nearbyDepartures(n, max = 6) {
  const rows = [];
  for (const s of n.stops) for (const g of (s.times ? depGroups(s.times) : [])) if (norm(titleish(g[0].headsign || "")) !== norm(titleish(s.name))) rows.push({ s, g, m: minutesUntil(g[0].place.departure || g[0].place.arrival) });
  rows.sort((a, b) => a.m - b.m || a.s.distance - b.s.distance);
  const seen = new Set(), out = [];
  for (const r of rows) { const k = (r.g[0].displayName || r.g[0].routeShortName) + "|" + r.g[0].headsign; if (seen.has(k)) continue; seen.add(k); out.push(r); if (out.length >= max) break; }
  return out;
}
function homeRow({ s, g }) {
  const x = g[0]; const p = x.place || {}; const later = g.slice(1).map(y => minutesUntil(y.place.departure || y.place.arrival)).filter(m => m < 60).slice(0, 2).map(m => nf(Math.max(0, m)));
  const walk = Math.max(1, Math.round(s.distance * 1.3 / 80));
  return `<button class="hrow ${p.cancelled ? "cancelled" : ""}" data-trip="${tripRef(x)}">${chip(liveName(x.displayName || x.routeShortName || x.tripShortName), liveColor(x.routeColor, x.mode), liveMode(x.mode))}
    <span class="hmid"><b>${esc(titleish(x.headsign || ""))}</b><small>${esc(titleish(s.name))} · ${t("walk_min", { m: nf(walk) })}${later.length ? ` · ${t("then")} ${later.join(", ")}′` : ""}</small></span>${depTimeHtml(x)}</button>`;
}
function renderHome(el) {
  if (S.view === "stop") return renderStop(el);
  if (S.view === "trip") return renderTrip(el);
  stopSrc = []; S.tripRefs = [];
  const n = S.nearby;
  const c = cityAt(...(n.center || S.me || CFG.DEFAULT_CENTER)); const F = c && FARES?.cities[c];
  const minFare = F && F.tickets.length ? Math.min(...F.tickets.map(x => x.price)) : null;
  const q = (act, icon, label, sub) => `<button class="qbtn" data-act="${act}"><span class="qi">${icon}</span><span class="ql">${label}</span>${sub ? `<small>${sub}</small>` : ""}</button>`;
  let html = `<p class="hello">${greeting()}</p>
    <button class="whereto big" data-act="where-to">${I.search}<span>${t("where_to")}</span></button>
    <div class="quick">
      ${q(S.home ? "go-home" : "hint-home", I.home, t("home"), S.home ? "" : t("set"))}
      ${q(S.work ? "go-work" : "hint-home", I.work, t("work"), S.work ? "" : t("set"))}
      ${q("open-tickets", '<b class="euro">€</b>', t("tickets"), minFare != null ? t("from_price", { p: eur(minFare) }) : "")}
      ${q("open-alerts", I.warn, t("alerts"), S.alerts.size ? nf(S.alerts.size) : "")}
    </div>
    <div class="sec-head"><h2>${t("departing")}</h2><span class="livepill ${n.loading ? "busy" : ""}" id="refreshLine">${n.updated ? `${liveIcon} ${fmtTime(new Date(n.updated))}` : ""}</span></div>
    ${nearbyStatus()}`;
  const state = nearbyState(n, CFG.NEARBY_RADIUS_M);
  if (state) html += state;
  else {
    const rows = nearbyDepartures(n);
    html += rows.length ? `<div class="hlist">${rows.map(homeRow).join("")}</div>` : `<div class="empty">${t("no_service")}</div>`;
    html += `<button class="btn tonal seeall" data-tab="nearby">${t("see_all_stops")} ${I.chev}</button>`;
  }
  el.innerHTML = html;
  clearMarkers(); showMe(); stopMarkers(n.stops);
}

/* STATIONS: every stop nearby, or your favourite stops */
function renderNearby(el) {
  if (S.view === "stop") return renderStop(el);
  if (S.view === "trip") return renderTrip(el);
  stopSrc = []; S.tripRefs = [];
  const n = S.nearby, R = CFG.NEARBY_RADIUS_M;
  let html = `<div class="tabs2" role="tablist"><button role="tab" data-st="nearby" aria-selected="${S.stationsTab === "nearby"}">${t("nearby")}</button><button role="tab" data-st="fav" aria-selected="${S.stationsTab === "fav"}">${t("favourites")}</button></div>`;
  if (S.stationsTab === "fav") {
    if (!S.favStops.length) html += `<div class="empty">${starIcon(false).replace('width="20" height="20"', 'width="40" height="40"')}<b>${t("favourites")}</b>${t("no_fav_stops")}</div>`;
    else html += `<div class="list">${S.favStops.map(f => { const d = S.favData[f.id]; const s = { ...f, stopId: f.id, distance: S.me ? hav(S.me, [f.lat, f.lon]) : null, times: d === undefined ? [] : d }; return d === undefined ? `<div class="skel"></div>` : stopCard(s, 4); }).join("")}</div>`;
    el.innerHTML = html; clearMarkers(); showMe(); stopMarkers(S.favStops.map(f => ({ ...f, stopId: f.id })));
    loadFavourites(); return;
  }
  html += nearbyStatus() + `<div class="refresh" id="refreshLine" aria-live="polite">${refreshLine()}</div>`;
  const state = nearbyState(n, R);
  if (state) html += state;
  else {
    const avail = new Set(n.stops.flatMap(s => [...(s.modes || []), ...(s.times || []).map(x => x.mode)]).map(modeCat));
    html += modeChips(avail);
    const cards = n.stops.filter(s => S.modeFilter === "all" || (s.modes || []).some(m => modeCat(m) === S.modeFilter) || (s.times || []).some(x => passFilter(x.mode))).map(s => stopCard(s, 4)).join("");
    html += cards ? `<div class="list">${cards}</div>` : `<div class="empty">${I.near}<b>${t("no_stops", { r: R })}</b></div>`;
  }
  el.innerHTML = html;
  clearMarkers(); showMe(); stopMarkers(n.stops);
}
let favLoading = false;
async function loadFavourites(force) {
  if (favLoading) return; favLoading = true;
  let changed = false;
  await Promise.all(S.favStops.map(async f => {
    if (!force && S.favData[f.id] !== undefined) return;
    try { const r = await api.get("/api/v1/stoptimes", { stopId: f.id, n: 14 }); S.favData[f.id] = r.stopTimes || []; } catch { S.favData[f.id] = null; }
    changed = true;
  }));
  favLoading = false;
  if (changed && S.tab === "nearby" && S.stationsTab === "fav" && !S.view) render();
}

/* trip page: every stop of one bus / tram / metro / train run, with live times */
async function renderTrip(el) {
  const ref = S.params.ref; const keep = S.params;
  el.innerHTML = `${backBtn(S.params.back || "to-nearby")}<div class="row" style="gap:10px;margin:4px 0 8px">${chip(ref.name, ref.color, liveMode(ref.mode))}<h2 class="title" style="margin:0;font-size:19px;flex:1;min-width:0" id="tripTitle">${t("trip")}</h2></div><div id="tripBody"><div class="skel"></div></div>`;
  clearMarkers(); showMe();
  try {
    const r = await api.get("/api/v5/trip", { tripId: ref.tripId }, { ttl: 20 });
    if (S.params !== keep) return;
    const l = r.legs.find(x => x.mode !== "WALK") || r.legs[0];
    const stops = [l.from, ...(l.intermediateStops || []), l.to];
    const now = Date.now();
    let nextIdx = stops.findIndex(s => new Date(s.departure || s.arrival) > now); if (nextIdx < 0) nextIdx = stops.length;
    $("#tripTitle").textContent = `${t("towards")} ${titleish(l.headsign || l.to.name)}`;
    const rows = stops.map((s, k) => {
      const tm = s.arrival && k ? s.arrival : s.departure || s.arrival; const sch = k ? (s.scheduledArrival || s.scheduledDeparture) : (s.scheduledDeparture || s.scheduledArrival);
      const passed = k < nextIdx; const shifted = l.realTime && tm && sch && Math.abs(new Date(tm) - new Date(sch)) >= 60000;
      return `<div class="tl-row" style="${passed ? "opacity:.55" : ""}"><div class="tl-time tnum">${tm ? fmtTime(new Date(tm)) : ""}${shifted ? `<s>${fmtTime(new Date(sch))}</s>` : ""}</div><div class="tl-rail ${k === 0 ? "first" : ""} ${k === stops.length - 1 ? "last" : ""}" style="--c:#${normColor(ref.color)}"><span class="node" ${k === nextIdx ? 'style="--c:var(--fg);background:var(--fg)"' : ""}></span></div><div class="tl-body"><div class="stn" style="font-weight:${k === nextIdx ? 800 : 600}">${esc(titleish(s.name))}</div>${s.track || (k === nextIdx && l.realTime) || s.cancelled ? `<div class="info">${s.track ? `<span class="plat">${t("platform")} ${esc(s.track)}</span>` : ""}${k === nextIdx ? delayBadge(sch, tm, l.realTime, s.cancelled) : s.cancelled ? `<span class="delay cx">${t("cancelled")}</span>` : ""}</div>` : ""}</div></div>`;
    }).join("");
    $("#tripBody").innerHTML = `<p class="muted small" style="margin:-4px 0 12px">${esc(l.agencyName || "")} · ${t("stops", stops.length)}${l.realTime ? ` · <span class="tag">${t("live")}</span>` : ""}</p><div class="tl">${rows}</div>`;
    const g = l.legGeometry; const pts = g?.points ? decode(g.points, g.precision || 6) : stops.map(s => [s.lat, s.lon]);
    setJourney({ type: "FeatureCollection", features: [{ type: "Feature", properties: { walk: false, color: "#" + normColor(ref.color) }, geometry: { type: "LineString", coordinates: pts.map(([a, b]) => [b, a]) } }] });
    stops.forEach((s, k) => { const m = addMarker(s.lat, s.lon, "mk-end", "", null, titleish(s.name)); Object.assign(m.style, { width: (k === nextIdx ? 16 : 10) + "px", height: (k === nextIdx ? 16 : 10) + "px", borderWidth: "3px", borderColor: "#" + normColor(ref.color) }); });
    fit(pts, 15);
  } catch {
    if (S.params !== keep) return;
    $("#tripBody").innerHTML = `<div class="err"><b>${t("trip_err")}</b><button class="btn tonal" data-act="retry-trip">${t("retry")}</button></div>`;
  }
}
function renderStop(el) {
  const s = S.params.s; if (!s) return go(S.tab);
  stopSrc = [s];
  el.innerHTML = `<button class="back" data-act="stop-back">${I.back}${t("back")}</button>
    <div class="row" style="flex-wrap:nowrap"><h2 class="title" style="flex:1;min-width:0;margin-bottom:4px">${esc(titleish(s.name))}</h2><button class="iconbtn star ${isFavStop(s) ? "on" : ""}" data-act="fav-stop" data-i="0" aria-pressed="${isFavStop(s)}" aria-label="${t(isFavStop(s) ? "remove_fav" : "add_fav")}">${starIcon(isFavStop(s))}</button></div>
    <p class="muted small" style="margin:0 0 8px">${[s.stopCode ? t("stop_code", { c: esc(s.stopCode) }) : "", s.distance != null ? fmtDist(s.distance) : ""].filter(Boolean).join(" · ")}</p><div class="refresh" id="refreshLine">${refreshLine()}</div>
    ${(() => { S.tripRefs = []; const avail = new Set((s.times || []).map(x => modeCat(x.mode))); return avail.size > 1 ? modeChips(avail) : ""; })()}
    <div class="stop-card">${(s.times || []).filter(x => passFilter(x.mode) && minutesUntil(x.place.departure || x.place.arrival) > -2).map(depRow).join("") || `<div class="dep"><span></span><div class="hd muted">${t("no_service")}</div><span></span></div>`}</div>
    <div class="row" style="margin-top:14px"><button class="btn tonal" data-act="stop-from">${t("from")}: ${esc(titleish(s.name))}</button><button class="btn tonal" data-act="stop-to">${t("to")}: ${esc(titleish(s.name))}</button></div>`;
  clearMarkers(); showMe(); addMarker(s.lat, s.lon, "mk-stop sel", modeIcon((s.modes || [])[0])); flyTo(s.lat, s.lon, 16.5);
}
function nearbyOffline(c) {
  const near = Object.entries(stations).map(([sid, st]) => ({ sid, st, d: hav(c, [st.lat, st.lon]) })).filter(x => x.d < 800).sort((a, b) => a.d - b.d).slice(0, 5);
  if (!near.length) return "";
  const p = romeParts(new Date()); const sec = p.h * 3600 + p.mi * 60;
  return `<h3 class="sub">${t("offline")}</h3><div class="list">${near.map(({ st, d }) => `<div class="stop-card"><div class="stop-head"><b>${esc(st.name)}</b><span class="muted small">${fmtDist(d)}</span></div>${st.lines.map(id => { const L = lineById[id], hw = headwayAt(L, sec); return `<div class="dep">${chip(lineName(L), L.color, L.mode)}<div class="hd">${esc(lineTermini(L))}<small>${t("est")}</small></div><div class="tm small">${hw ? t("every", { m: nf(Math.round(hw)) }) : t("no_service")}</div></div>`; }).join("")}</div>`).join("")}</div>`;
}

/* ================= fares ================= */
function cityAt(lat, lon) { if (!NET) return null; let best = null, bd = 30000; for (const c of NET.cities) { const d = hav([lat, lon], c.center); if (d < bd) { bd = d; best = c.id; } } return best; }
const tName = tk => (lang() === "it" ? tk.it : tk.en);
/* estimated fare of a live itinerary: urban tickets only, never guessed for trains or other operators */
function fareFor(it) {
  if (!FARES) return null;
  const legs = it.legs.filter(l => l.mode !== "WALK"); if (!legs.length) return null;
  const city = cityAt(legs[0].from.lat, legs[0].from.lon); const F = city && FARES.cities[city];
  if (!F || !F.single) return { other: true };
  const re = new RegExp(F.agencies, "i");
  if (!legs.every(l => re.test(l.agencyName || ""))) return { other: true };
  let tk = F.tickets.find(x => x.id === F.single);
  if (city === "catania" && legs.some(l => /amts/i.test(l.agencyName || ""))) tk = F.tickets.find(x => x.id === "mb120");
  const mins = (new Date(legs[legs.length - 1].endTime) - new Date(legs[0].startTime)) / 60000;
  const n = tk.minutes ? Math.max(1, Math.ceil(mins / tk.minutes)) : legs.length;
  return { price: n * tk.price, n, tk };
}
function fareBadge(it) {
  const f = fareFor(it); if (!f) return "";
  if (f.other) return `<span class="fare other">${t("fare_other")}</span>`;
  return `<span class="fare">${eur(f.price)} <small>${t("fare_n", { n: f.n, t: esc(tName(f.tk)) })}</small></span>`;
}
function renderAlerts(el) {
  const list = [...S.alerts.values()].sort((a, b) => (b.cause === "STRIKE") - (a.cause === "STRIKE"));
  const city = nearestCity(); const idx = LIDX[city];
  if (!idx) loadLineIndex(city).then(() => { if (S.view === "alerts") render(); }).catch(() => {});
  el.innerHTML = `${backBtn(S.params.back || "to-more")}<h2 class="title">${t("service_alerts")}</h2>` + (list.length ? `<div class="list">${list.map(a => `<div class="alertitem ${a.cause === "STRIKE" ? "strk" : ""}">${I.warn}<div><b>${esc(a.h)}</b>${a.lines.size ? `<div class="served">${[...a.lines].slice(0, 12).map(nm => { const r = idx?.routes.find(x => x.s === nm); return r ? `<button class="chipbtn" data-lr="${city}|${r.i}">${chip(nm, lineColor(r), lineChipMode(r), true)}</button>` : chip(nm, "5B6770", "BUS", true); }).join("")}</div>` : ""}${a.d && a.d !== a.h ? `<p>${esc(a.d)}</p>` : ""}</div></div>`).join("")}</div>`
    : `<div class="empty">${I.warn}<b>${t("service_alerts")}</b>${t("no_alerts")}</div>`) + `<a class="linkrow" href="https://scioperi.mit.gov.it/mit2/public/scioperi" target="_blank" rel="noopener" style="margin-top:12px">${I.warn}<span style="flex:1"><b>${t("strikes")}</b><br><span class="muted small">scioperi.mit.gov.it</span></span>${I.ext}</a>`;
  clearMarkers(); showMe();
}
function renderTickets(el) {
  const cities = ["rome", "milan", "naples", "turin", "genoa", "catania"];
  const city = S.params.city || cityAt(...(S.me || CFG.DEFAULT_CENTER)) || "rome"; const F = FARES?.cities[city];
  const checked = FARES ? new Intl.DateTimeFormat(locale(), { dateStyle: "long", timeZone: "UTC" }).format(new Date(FARES.checked)) : "";
  el.innerHTML = `${backBtn(S.params.back || "to-more")}<h2 class="title">${t("ticket_prices")}</h2>
    <div class="chips" role="group">${cities.map(c => `<button class="chip" data-tcity="${c}" aria-pressed="${c === city}">${esc(cityById[c]?.name || c)}</button>`).join("")}</div>
    ${!F ? `<div class="skel"></div>` : F.tickets.length ? `<div class="list" style="margin-top:8px">${F.tickets.map(tk => `<div class="ticket"><div><b>${esc(tName(tk))}</b>${tk.minutes ? `<small>${t("valid_min", { m: tk.minutes })}</small>` : ""}${tk[lang() + "_note"] ? `<small>${esc(tk[lang() + "_note"])}</small>` : ""}</div><span class="price tnum">${eur(tk.price)}</span></div>`).join("")}</div>`
      : `<div class="alert" style="margin-top:8px">${I.warn}<span>${t("no_prices")}</span></div>`}
    ${F ? `<p class="small muted" style="margin:14px 0 8px">${esc(t("prices_checked", { o: F.operator, d: F.checked ? new Intl.DateTimeFormat(locale(), { dateStyle: "long", timeZone: "UTC" }).format(new Date(F.checked)) : checked }))} ${t("prices_auto")}</p><a class="btn tonal" href="${esc(F.source)}" target="_blank" rel="noopener">${t("official_site")} ${I.ext.replace("<svg", '<svg width="16" height="16"')}</a>` : ""}`;
  clearMarkers(); showMe();
}

/* ================= plan (live, offline fallback) ================= */
let geoTimer = null, geoReq = 0;
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function offlineSuggest(q) {
  q = norm(q.trim()); if (!q || !NET) return [];
  const out = [];
  for (const [sid, st] of Object.entries(stations)) { const n = norm(st.name); const sc = n.startsWith(q) ? 1 : n.split(/[\s/–-]+/).some(w => w.startsWith(q)) ? 2 : 9; if (sc < 9) out.push([sc, { kind: "station", sid, name: st.name, lat: st.lat, lon: st.lon, area: cityById[cityOf(sid)].name, lines: st.lines }]); }
  return out.sort((a, b) => a[0] - b[0] || a[1].name.length - b[1].name.length).slice(0, 6).map(x => x[1]);
}
async function showSugg(q) {
  const box = $("#sugg"), rest = $("#planRest"); if (!box) return;
  if (!q.trim()) { box.innerHTML = ""; rest.hidden = false; return; }
  rest.hidden = true;
  const id = ++geoReq; let res = [], failed = false;
  if (q.trim().length >= 2 && !S.simOffline) {
    try {
      const bias = S.me || (map ? [map.getCenter().lat, map.getCenter().lng] : null);
      const r = await api.get("/api/v1/geocode", { text: q.trim(), language: lang(), place: bias ? `${bias[0]},${bias[1]}` : null }, { ttl: 600, retries: 1 });
      res = r.filter(x => x.country === "IT" || !x.country).slice(0, 8).map(x => ({ kind: x.type === "STOP" ? "stop" : x.type === "ADDRESS" ? "address" : "place", name: titleish(x.name) + (x.houseNumber && !x.name.includes(x.houseNumber) ? " " + x.houseNumber : ""), lat: x.lat, lon: x.lon, area: (x.areas || []).find(a => a.default)?.name || "", id: x.id }));
    } catch { failed = true; }
  }
  if (id !== geoReq) return;
  if (!res.length) res = offlineSuggest(q);
  box._res = res;
  box.innerHTML = (failed ? `<p class="small muted">${t("geo_err")}</p>` : "") + (res.length ? `<ul class="suggest" role="listbox">${res.map((p, i) => `<li><button role="option" data-act="pick" data-i="${i}"><span class="ic">${p.kind === "station" ? modeIcon(lineById[p.lines[0]].mode) : p.kind === "stop" ? I.bus : I.pin}</span><span style="min-width:0"><span class="t">${esc(p.name)}</span><span class="s">${esc(p.area || "")}${p.kind === "station" ? " · " + p.lines.slice(0, 6).map(lid => chip(lineName(lineById[lid]), lineById[lid].color, lineById[lid].mode, true)).join("") : p.area ? " · " + t(p.kind) : t(p.kind)}</span></span></button></li>`).join("")}</ul>` : `<div class="empty"><b>${t("no_routes")}</b></div>`);
}
function defaultTimeVal() { const p = romeParts(new Date()); return `${p.y}-${String(p.mo).padStart(2, "0")}-${String(p.d).padStart(2, "0")}T${String(p.h).padStart(2, "0")}:${String(p.mi).padStart(2, "0")}`; }
function selectedDate() { if (S.timeMode === "now" || !S.timeVal) return new Date(); const [ds, ts] = S.timeVal.split("T"); const [y, mo, d] = ds.split("-").map(Number); const [h, mi] = ts.split(":").map(Number); return romeToDate(y, mo, d, h, mi); }
function renderPlan(el) {
  if (S.view === "results") return renderResults(el);
  if (S.view === "detail") return renderDetail(el);
  el.innerHTML = `<h2 class="title">${t("plan")}</h2>
    <div class="planner" role="group" aria-label="${t("plan")}">
      <label class="field"><span class="pin" aria-hidden="true"></span><input id="fromIn" autocomplete="off" placeholder="${t("choose_start")}" aria-label="${t("from")}" value="${esc(S.from?.name || "")}"></label>
      <label class="field"><span class="pin to" aria-hidden="true"></span><input id="toIn" autocomplete="off" placeholder="${t("choose_dest")}" aria-label="${t("to")}" value="${esc(S.to?.name || "")}"></label>
      <button class="swap" data-act="swap" aria-label="${t("swap")}">${I.swap}</button>
    </div>
    <div id="sugg"></div>
    <div id="planRest">
      <div class="chips" role="group">
        <button class="chip" data-act="myloc">${I.near}${t("my_location")}</button>
        <button class="chip" data-act="pickmap">${I.map}${t("pick_map")}</button>
<button class="chip" data-act="${S.home ? "use-home" : "hint-home"}">${I.home}${S.home ? t("home") : t("set_home")}</button><button class="chip" data-act="${S.work ? "use-work" : "hint-home"}">${I.work}${S.work ? t("work") : t("set_work")}</button>
      </div>
      <div class="seg" role="group" style="margin-top:12px">${["now", "depart", "arrive"].map(m => `<button data-time="${m}" aria-pressed="${S.timeMode === m}">${t(m === "now" ? "now" : m === "depart" ? "depart_at" : "arrive_by")}</button>`).join("")}</div>
      ${S.timeMode !== "now" ? `<div style="margin-top:8px"><input class="timein tnum" id="timeIn" type="datetime-local" value="${S.timeVal || defaultTimeVal()}" aria-label="${t("depart_at")}"></div>` : ""}
      <button class="btn" data-act="search" style="width:100%;margin-top:14px">${t("search")}</button>
      ${S.recents.length ? `<h3 class="sub">${t("recent")}</h3><div class="list">${S.recents.slice(0, 5).map((r, i) => `<button class="line-row" data-act="recent" data-i="${i}">${I.clock.replace("<svg", '<svg width="20" height="20"')}<span class="t">${esc(r.from.name)} → ${esc(r.to.name)}</span></button>`).join("")}</div>` : ""}
    </div>`;
  clearMarkers(); showMe();
  if (S.from) addMarker(S.from.lat, S.from.lon, "mk-end"); if (S.to) addMarker(S.to.lat, S.to.lon, "mk-end to");
  if (S.from && S.to) fit([[S.from.lat, S.from.lon], [S.to.lat, S.to.lon]], 15);
  for (const id of ["fromIn", "toIn"]) {
    const inp = $("#" + id);
    inp.addEventListener("focus", () => { S.focus = id; setSnap(2); if (inp.value && !(id === "fromIn" ? S.from : S.to)) showSugg(inp.value); });
    inp.addEventListener("input", () => { if (id === "fromIn") S.from = null; else S.to = null; clearTimeout(geoTimer); geoTimer = setTimeout(() => showSugg(inp.value), 280); });
    inp.addEventListener("keydown", e => { if (e.key === "Enter") $("#sugg button")?.click(); if (e.key === "Escape") inp.blur(); });
  }
}
function doSearch() {
  if (!S.from || !S.to) { toast(t("pick_both")); return; }
  S.recents = [{ from: S.from, to: S.to }, ...S.recents.filter(r => !(r.from.name === S.from.name && r.to.name === S.to.name))].slice(0, 8); store.set("recents", S.recents);
  S.focus = null; S.planResult = null; go("plan", "results"); runPlan();
}
const placeParam = p => p.id && p.kind === "stop" ? p.id : `${p.lat},${p.lon}`;
async function runPlan() {
  const when = selectedDate();
  try {
    const r = await api.get("/api/v5/plan", { fromPlace: placeParam(S.from), toPlace: placeParam(S.to), time: S.timeMode === "now" ? null : when.toISOString(), arriveBy: S.timeMode === "arrive" ? "true" : null, numItineraries: 6 }, { ttl: 60 });
    for (const it of r.itineraries || []) for (const l of it.legs) noteAlerts(l.alerts);
    let its = r.itineraries || [];
    if (S.pref === "fewest") its = [...its].sort((a, b) => a.transfers - b.transfers || a.duration - b.duration);
    S.planResult = { live: true, its, direct: r.direct || [] };
  } catch {
    const p = romeParts(when); S.planResult = { live: false, off: offlinePlans(S.from, S.to, p.h * 3600 + p.mi * 60, S.timeMode === "arrive") };
  }
  if (S.tab === "plan" && S.view === "results") render();
}
function legChips(legs) {
  return legs.map((l, i) => {
    const sep = i ? `<svg class="sep" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>` : "";
    if (l.mode === "WALK" || l.kind === "walk") { const s = l.duration ?? l.s; return s >= 120 ? sep + `<span class="walk" aria-label="${t("walk")}">${I.walk}${Math.round(s / 60)}</span>` : ""; }
    if (l.kind === "ride") { const L = lineById[l.line]; return sep + chip(lineName(L), L.color, L.mode); }
    return sep + chip(liveName(l.displayName || l.routeShortName || l.tripShortName), liveColor(l.routeColor, l.mode), liveMode(l.mode));
  }).join("").replace(/^<svg class="sep"[^]*?<\/svg>/, "");
}
function decode(str, prec = 6) { const f = 10 ** prec; let i = 0, lat = 0, lon = 0; const out = []; while (i < str.length) { for (const w of [0, 1]) { let r = 0, s = 0, b; do { b = str.charCodeAt(i++) - 63; r |= (b & 31) << s; s += 5; } while (b >= 32); const d = r & 1 ? ~(r >> 1) : r >> 1; if (w) lon += d; else lat += d; } out.push([lat / f, lon / f]); } return out; }
function liveJourneyFC(it) {
  const feats = [], pts = [];
  for (const l of it.legs) { const g = l.legGeometry; const p = g?.points ? decode(g.points, g.precision || 6) : [[l.from.lat, l.from.lon], [l.to.lat, l.to.lon]]; pts.push(...p); feats.push({ type: "Feature", properties: { walk: l.mode === "WALK", color: "#" + liveColor(l.routeColor, l.mode) }, geometry: { type: "LineString", coordinates: p.map(([a, b]) => [b, a]) } }); }
  return { fc: { type: "FeatureCollection", features: feats }, pts };
}
function offLegPts(l) { if (l.kind === "walk") { const a = l.from ? stations[l.from] : S.from, b = l.to ? stations[l.to] : S.to; return [[a.lat, a.lon], [b.lat, b.lon]]; } return [l.from, ...l.stops].map(s => [stations[s].lat, stations[s].lon]); }
function offJourneyFC(o) { const pts = []; const feats = o.legs.map(l => { const p = offLegPts(l); pts.push(...p); return { type: "Feature", properties: { walk: l.kind === "walk", color: "#" + (l.kind === "ride" ? lineById[l.line].color : "5B6770") }, geometry: { type: "LineString", coordinates: p.map(([a, b]) => [b, a]) } }; }); return { fc: { type: "FeatureCollection", features: feats }, pts }; }
function endMarkers() { clearMarkers(); showMe(); addMarker(S.from.lat, S.from.lon, "mk-end"); addMarker(S.to.lat, S.to.lon, "mk-end to"); }
const backBtn = act => `<button class="back" data-act="${act}">${I.back}${t("back")}</button>`;
function renderResults(el) {
  const R = S.planResult; let html = `${backBtn("to-plan")}<h2 class="title">${esc(S.from.name)} → ${esc(S.to.name)}</h2>
    <div class="seg" role="group" aria-label="${t("sort_by")}" style="margin-bottom:12px"><button data-pref="fastest" aria-pressed="${S.pref === "fastest"}">${t("fastest")}</button><button data-pref="fewest" aria-pressed="${S.pref === "fewest"}">${t("fewest")}</button></div>`;
  const saveRow = S.to && S.to.kind !== "me" && S.home?.name !== S.to.name && S.work?.name !== S.to.name
    ? `<div class="row" style="margin-top:14px"><span class="muted small">${t("save_place")}:</span><button class="chip" data-act="save-home">${I.home}${t("home")}</button><button class="chip" data-act="save-work">${I.work}${t("work")}</button></div>` : "";
  endMarkers();
  if (!R) { el.innerHTML = html + `<div class="list" aria-busy="true" aria-label="${t("loading")}"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>`; fit([[S.from.lat, S.from.lon], [S.to.lat, S.to.lon]], 15); return; }
  if (R.live) {
    if (!R.its.length) html += `<div class="empty">${I.route}<b>${t("no_routes")}</b>${t("no_routes_s")}<div style="margin-top:12px"><button class="btn tonal" data-act="retry-plan">${t("retry")}</button></div></div>`;
    html += `<div class="list">${R.its.map((it, i) => {
      const tr = it.legs.filter(l => l.mode !== "WALK"); const firstT = tr[0]; const delay = tr.map(l => delayBadge(l.scheduledStartTime, l.startTime, l.realTime, l.cancelled)).find(Boolean) || "";
      const walk = it.legs.filter(l => l.mode === "WALK").reduce((a, l) => a + (l.distance || 0), 0);
      return `<button class="card" data-act="detail" data-i="${i}"><div class="res-top"><span class="res-time tnum">${fmtTime(new Date(it.startTime))} – ${fmtTime(new Date(it.endTime))}</span><span class="res-dur tnum">${fmtDur(it.duration)}</span></div>
        <div class="res-legs">${legChips(it.legs)}</div><div class="res-meta"><span>${t("changes", it.transfers)}</span>${walk ? `<span>· ${t("total_walk", { d: fmtDist(walk) })}</span>` : ""}${firstT ? `<span>· ${t("depart")} ${esc(titleish(firstT.from.name))}${firstT.from.track ? ` · ${t("platform")} ${esc(firstT.from.track)}` : ""}</span>` : ""}${delay}</div>${fareBadge(it) ? `<div class="res-fare">${fareBadge(it)}</div>` : ""}</button>`;
    }).join("")}</div>`;
    if (R.its[0]) { const { fc, pts } = liveJourneyFC(R.its[0]); setJourney(fc); fit(pts); }
  } else {
    html += `<div class="alert" role="status">${I.off}<span>${t("offline_note")}</span></div>`;
    if (R.off.error) html += `<div class="empty">${I.route}<b>${t("no_routes")}</b>${R.off.error === "city" ? t("same_city") : t("no_routes_s")}<div style="margin-top:12px"><button class="btn tonal" data-act="retry-plan">${t("retry")}</button></div></div>`;
    else { html += `<div class="list" style="margin-top:8px">${R.off.map((o, i) => `<button class="card" data-act="detail" data-i="${i}"><div class="tag">${t(o.pref)}</div><div class="res-top"><span class="res-time tnum">≈ ${secOfDay(o.dep)} – ${secOfDay(o.arr)}</span><span class="res-dur tnum">${fmtDur(o.dur)}</span></div><div class="res-legs">${legChips(o.legs)}</div><div class="res-meta"><span>${t("changes", o.transfers)}</span>${o.walk ? `<span>· ${t("total_walk", { d: fmtDist(o.walk) })}</span>` : ""}<span class="delay" style="background:var(--surface-3);color:var(--fg-2)">${t("estimated")}</span></div></button>`).join("")}</div>`;
      const { fc, pts } = offJourneyFC(R.off[0]); setJourney(fc); fit(pts); }
  }
  el.innerHTML = html + (R ? saveRow : "");
}
function renderDetail(el) {
  const R = S.planResult, i = S.params.i; const rows = [];
  const row = (time, sched, cls, color, node, body) => rows.push(`<div class="tl-row"><div class="tl-time tnum">${time}${sched ? `<s>${sched}</s>` : ""}</div><div class="tl-rail ${cls}" style="--c:${color}">${node}</div><div class="tl-body">${body}</div></div>`);
  let html = `<div class="row" style="justify-content:space-between">${backBtn("to-results")}<button class="btn text" data-act="share">${t("share")}</button></div><h2 class="title">${t("details")}</h2>`;
  endMarkers();
  if (R.live) {
    const it = R.its[i];
    html += `<div class="res-top"><span class="res-time tnum">${fmtTime(new Date(it.startTime))} – ${fmtTime(new Date(it.endTime))}</span><span class="res-dur tnum">${fmtDur(it.duration)}</span></div><div class="res-meta" style="margin-bottom:12px">${t("changes", it.transfers)} ${fareBadge(it)}</div>`;
    it.legs.forEach((l, k) => {
      const walk = l.mode === "WALK"; const st = new Date(l.startTime), sst = new Date(l.scheduledStartTime || l.startTime); const shifted = l.realTime && Math.abs(st - sst) >= 60000;
      const fromName = k === 0 ? S.from.name : titleish(l.from.name);
      if (walk) row(fmtTime(st), "", "walk" + (k === 0 ? " first" : ""), "var(--fg-3)", `<span class="node" style="--c:var(--fg-3)"></span>`, `<div class="stn">${esc(fromName)}</div><div class="info">${t("walk_m", { d: fmtDist(l.distance || 0) })} · ${fmtDur(l.duration)}</div>`);
      else {
        const alerts = (l.alerts || []).slice(0, 2).map(a => `<div class="alert ${a.cause === "STRIKE" ? "strk" : ""}">${I.warn}<span><b>${esc(a.headerText || "")}</b></span></div>`).join("");
        const stops = l.intermediateStops || [];
        row(fmtTime(st), shifted ? fmtTime(sst) : "", k === 0 ? "first" : "", "#" + liveColor(l.routeColor, l.mode), `<span class="node"></span>`,
          `<div class="stn">${esc(fromName)}</div><div class="info">${chip(liveName(l.displayName || l.routeShortName), liveColor(l.routeColor, l.mode), liveMode(l.mode))}<span>${t("towards")} ${esc(titleish(l.headsign || ""))}</span>${l.from.track ? `<span class="plat">${t("platform")} ${esc(l.from.track)}</span>` : ""}${delayBadge(l.scheduledStartTime, l.startTime, l.realTime, l.cancelled)}</div>
           <div class="info">${esc(l.agencyName || "")} · ${fmtDur(l.duration)}</div>
           <details class="stops"><summary>${t("stops", stops.length + 1)} ▾</summary><ol>${stops.map(s => `<li>${esc(titleish(s.name))}</li>`).join("")}<li>${esc(titleish(l.to.name))}</li></ol></details>${alerts}`);
      }
    });
    row(fmtTime(new Date(it.endTime)), "", "last", "var(--fg)", `<span class="node" style="--c:var(--fg)"></span>`, `<div class="stn">${esc(S.to.name)}</div><div class="info">${t("arrive")}</div>`);
    const { fc, pts } = liveJourneyFC(it); setJourney(fc); fit(pts);
  } else {
    const o = R.off[i]; let tc = o.dep;
    html += `<div class="snap">${I.map}${t("est")}</div><div class="res-top"><span class="res-time tnum">≈ ${secOfDay(o.dep)} – ${secOfDay(o.arr)}</span><span class="res-dur tnum">${fmtDur(o.dur)}</span></div><div class="res-meta" style="margin-bottom:12px">${t("changes", o.transfers)}</div>`;
    o.legs.forEach((l, k) => {
      const fromName = l.from ? stations[l.from].name : S.from.name;
      if (l.kind === "walk") { row(secOfDay(tc), "", "walk" + (k === 0 ? " first" : ""), "var(--fg-3)", `<span class="node" style="--c:var(--fg-3)"></span>`, `<div class="stn">${esc(fromName)}</div><div class="info">${t("walk_m", { d: fmtDist(l.d) })} · ${fmtDur(l.s)}</div>`); tc += l.s; }
      else { const L = lineById[l.line]; const term = (() => { for (const b of L.branches) { const a = b.indexOf(l.from), z = b.indexOf(l.to); if (a >= 0 && z >= 0) return stations[a < z ? b[b.length - 1] : b[0]].name; } return ""; })(); const hw = headwayAt(L, l.dep);
        row(secOfDay(l.dep), "", k === 0 ? "first" : "", "#" + L.color, `<span class="node"></span>`, `<div class="stn">${esc(fromName)}</div><div class="info">${chip(lineName(L), L.color, L.mode)}<span>${t("towards")} ${esc(term)}</span>${hw ? `<span class="est">${t("every", { m: nf(Math.round(hw)) })}</span>` : ""}</div><details class="stops"><summary>${t("stops", l.stops.length)} ▾</summary><ol>${l.stops.map(s => `<li>${esc(stations[s].name)}</li>`).join("")}</ol></details>`); tc = l.arr; }
    });
    row(secOfDay(o.arr), "", "last", "var(--fg)", `<span class="node" style="--c:var(--fg)"></span>`, `<div class="stn">${esc(S.to.name)}</div><div class="info">${t("arrive")}</div>`);
    const { fc, pts } = offJourneyFC(o); setJourney(fc); fit(pts);
  }
  el.innerHTML = html + `<div class="tl">${rows.join("")}</div>`;
}

/* ================= lines & stations ================= */
/* ================= lines: every bus, tram, metro, rail line of a city ================= */
const LIDX = {}; // city -> loaded index
async function loadLineIndex(city) {
  if (LIDX[city]) return LIDX[city];
  const d = await (await fetch(`data/lines/${city}.json`)).json();
  d.stops = d.stops.map(([n, la, lo, c]) => ({ name: n, lat: la / 1e5, lon: lo / 1e5, code: c }));
  d.routes.forEach((r, i) => { r.i = i; r.cat = r.m === "rail" ? "train" : r.m === "funicular" ? "other" : r.m; r.sh = r.sh.map(a => { const o = []; for (let k = 0; k < a.length; k += 2) o.push([a[k] / 1e5, a[k + 1] / 1e5]); return o; }); });
  return (LIDX[city] = d);
}
const LINE_CITIES = ["rome", "milan", "naples", "turin", "genoa", "catania"];
function nearestCity() { const c = S.me || (map ? [map.getCenter().lat, map.getCenter().lng] : CFG.DEFAULT_CENTER); if (!NET) return "rome"; let best = "rome", bd = 1e12; for (const k of LINE_CITIES) { const d = hav(c, cityById[k].center); if (d < bd) { bd = d; best = k; } } return best; }
const lineKey = (city, r) => `${city}|${r.id}`;
const lineColor = r => r.c || CAT_COLOR[r.cat] || "5B6770";
const lineChipMode = r => r.m === "metro" ? "metro" : r.m === "rail" ? "RAIL" : r.m === "tram" ? "TRAM" : r.m === "ferry" ? "FERRY" : r.m === "funicular" ? "FUNICULAR" : "BUS";
const alertsForLine = name => [...S.alerts.values()].filter(a => a.lines.has(name));
function lineRow(city, r) {
  const al = alertsForLine(r.s).length;
  return `<button class="line-row" data-lr="${city}|${r.i}">${chip(r.s, lineColor(r), lineChipMode(r))}<span style="min-width:0;flex:1"><span class="t" style="display:block">${esc(r.l)}</span></span>${al ? `<span class="info-dot" aria-label="${t("alerts")}">!</span>` : ""}${I.chev}</button>`;
}
function renderLines(el) {
  if (S.view === "lx") return renderLineX(el);
  if (S.view === "line") return renderNetLine(el);
  if (S.view === "station") return renderStation(el);
  if (!S.linesCity || !LINE_CITIES.includes(S.linesCity)) S.linesCity = nearestCity();
  const city = S.linesCity, idx = LIDX[city];
  if (S.lineTab === "alerts") S.lineTab = "all";
  const tabs = [["all", t("all")], ["bus", t("bus")], ["metro", t("metro")], ["tram", t("tram")], ["train", t("train")], ["other", t("funicular")], ["ferry", t("ferry")], ["fav", "★ " + t("favourites")]]
    .filter(([k]) => !idx || ["fav", "all"].includes(k) || idx.routes.some(r => r.cat === k));
  el.innerHTML = `<label class="lsearch">${I.search}<input id="lineQ" type="search" autocomplete="off" placeholder="${t("search_line")}" aria-label="${t("search_line")}" value="${esc(S.lineQ)}"></label>
    <div class="chips" role="group" aria-label="${t("city")}">${LINE_CITIES.map(c => `<button class="chip" data-city="${c}" aria-pressed="${c === city}">${esc(cityById[c]?.name || c)}</button>`).join("")}</div>
    <div class="tabs2 scroll" role="tablist">${tabs.map(([k, l]) => `<button role="tab" data-ltab="${k}" aria-selected="${S.lineTab === k}">${l}</button>`).join("")}</div>
    <div id="lineList">${idx ? "" : `<div class="snap">${t("loading_lines")}</div><div class="skel"></div>`}</div>`;
  clearMarkers(); showMe(); setFocus(emptyFC);
  const q = $("#lineQ"); q.addEventListener("input", () => { S.lineQ = q.value; S.linesShown = 60; fillLineList(); });
  if (!idx) loadLineIndex(city).then(() => { if (S.tab === "lines" && !S.view && S.linesCity === city) render(); }).catch(() => { $("#lineList").innerHTML = `<div class="err"><b>${t("err_title")}</b><button class="btn tonal" data-act="lines-retry">${t("retry")}</button></div>`; });
  else fillLineList();
}
function fillLineList() {
  const box = $("#lineList"); const city = S.linesCity, idx = LIDX[city]; if (!box || !idx) return;
  const q = norm(S.lineQ.trim());
  let routes = idx.routes;
  if (S.lineTab === "fav") routes = routes.filter(r => S.favLines.includes(lineKey(city, r)));
  else if (!["all", "alerts"].includes(S.lineTab)) routes = routes.filter(r => r.cat === S.lineTab);
  if (q) routes = routes.filter(r => norm(r.s).startsWith(q) || norm(r.l).includes(q)).sort((a, b) => (norm(b.s) === q) - (norm(a.s) === q) || (norm(b.s).startsWith(q)) - (norm(a.s).startsWith(q)));
  let html = "";
  if (!q && S.lineTab === "all") {
    const rec = S.recentLines.filter(k => k.startsWith(city + "|")).map(k => idx.routes.find(r => lineKey(city, r) === k)).filter(Boolean);
    if (rec.length) html += `<div class="row" style="justify-content:space-between;margin-top:6px"><h3 class="sub" style="margin:8px 0">${t("recent_lines")}</h3><button class="btn text" data-act="clear-recent-lines">${t("clear")}</button></div><div class="list">${rec.map(r => lineRow(city, r)).join("")}</div><h3 class="sub">${t("all")}</h3>`;
  }
  if (S.lineTab === "fav" && !routes.length) html += `<div class="empty">${starIcon(false).replace('width="20" height="20"', 'width="40" height="40"')}<b>${t("favourites")}</b>${t("no_fav_lines")}</div>`;
  else if (!routes.length) html += `<div class="empty"><b>${t("no_lines")}</b></div>`;
  else html += `<div class="list">${routes.slice(0, S.linesShown).map(r => lineRow(city, r)).join("")}</div>${routes.length > S.linesShown ? `<button class="btn tonal" style="width:100%;margin-top:10px" data-act="more-lines">${t("show_more")} (${nf(routes.length - S.linesShown)})</button>` : ""}`;
  box.innerHTML = html;
}
/* one line: stops of the chosen direction, live vehicles, next arrival at any stop */
function renderLineX(el) {
  const { city, i } = S.params; const idx = LIDX[city]; if (!idx) return go("lines");
  const r = idx.routes[i]; const dir = Math.min(S.params.dir || 0, r.p.length - 1); const pat = r.p[dir]; const stops = pat.map(k => idx.stops[k]);
  const key = lineKey(city, r); const fav = S.favLines.includes(key); const col = lineColor(r);
  const al = alertsForLine(r.s);
  S.lineFocus = { name: r.s, cat: r.cat }; drawVehicles();
  el.innerHTML = `${backBtn("to-lines")}
    <div class="row" style="flex-wrap:nowrap;gap:10px;margin:4px 0 2px">${chip(r.s, col, lineChipMode(r))}<h2 class="title" style="margin:0;font-size:18px;flex:1;min-width:0">${esc(r.l)}</h2><button class="iconbtn star ${fav ? "on" : ""}" data-act="fav-line" aria-pressed="${fav}" aria-label="${t(fav ? "remove_fav" : "add_fav")}">${starIcon(fav)}</button></div>
    <p class="muted small" style="margin:0 0 10px">${esc(idx.operator)} · ${t(r.cat === "other" ? "funicular" : r.cat)} · <span id="vehCount"></span></p>
    ${al.map(a => `<div class="alert ${a.cause === "STRIKE" ? "strk" : ""}">${I.warn}<span><b>${esc(a.h)}</b></span></div>`).join("")}
    ${r.p.length > 1 ? `<div class="seg" role="group" aria-label="${t("direction")}" style="margin:8px 0">${r.p.map((p, k) => `<button data-dir="${k}" aria-pressed="${k === dir}">→ ${esc(idx.stops[p[p.length - 1]].name)}</button>`).join("")}</div>` : ""}
    <p class="est" style="margin:6px 0 4px">${t("tap_stop")}</p>
    <ol class="diagram" style="--c:#${col}">${stops.map((s, k) => `<li><span class="rail"><i></i></span><div><button data-ls="${k}"><span style="font-weight:600">${esc(s.name)}</span>${s.code ? `<small class="muted">${t("stop_code", { c: esc(s.code) })}</small>` : ""}</button><div class="lsdeps" id="ls${k}"></div></div></li>`).join("")}</ol>`;
  clearMarkers(); showMe();
  const shape = r.sh[dir]?.length > 1 ? r.sh[dir] : stops.map(s => [s.lat, s.lon]);
  setFocus({ type: "FeatureCollection", features: [{ type: "Feature", properties: { color: "#" + col }, geometry: { type: "LineString", coordinates: shape.map(([a, b]) => [b, a]) } }] });
  stops.forEach((s, k) => { const m = addMarker(s.lat, s.lon, "mk-end", "", () => showLineStop(k), s.name); Object.assign(m.style, { width: "11px", height: "11px", borderWidth: "3px", borderColor: "#" + col }); });
  fit(shape, 15);
  updateVehCount();
}
function updateVehCount() { const el = $("#vehCount"); if (!el || !S.lineFocus) return; const now = Date.now(); const n = new Set(S.vehicles.filter(v => v.name === S.lineFocus.name && v.cat === (S.lineFocus.cat === "other" ? "other" : S.lineFocus.cat) && now <= v.arr + 30000 && now >= v.dep - 60000).map(v => v.tripId)).size; el.textContent = t("vehicles_now", n); }
async function showLineStop(k) {
  const { city, i } = S.params; const idx = LIDX[city]; const r = idx.routes[i]; const dir = Math.min(S.params.dir || 0, r.p.length - 1);
  const s = idx.stops[r.p[dir][k]]; const box = $("#ls" + k); if (!box) return;
  box.innerHTML = `<div class="skel" style="height:44px"></div>`; flyTo(s.lat, s.lon, 16);
  try {
    const d = 0.0012; const raw = await api.get("/api/v1/map/stops", { min: `${s.lat - d},${s.lon - d}`, max: `${s.lat + d},${s.lon + d}` }, { ttl: 300 });
    const cands = raw.sort((a, b) => (norm(titleish(b.name)) === norm(s.name)) - (norm(titleish(a.name)) === norm(s.name)) || hav([s.lat, s.lon], [a.lat, a.lon]) - hav([s.lat, s.lon], [b.lat, b.lon])).slice(0, 3);
    let times = [];
    for (const c of cands) { const res = await api.get("/api/v1/stoptimes", { stopId: c.parentId || c.stopId, n: 30 }); times = (res.stopTimes || []).filter(x => liveName(x.displayName || x.routeShortName) === r.s); if (times.length) break; }
    const box2 = $("#ls" + k); if (!box2) return;
    S.tripRefs = S.tripRefs || [];
    box2.innerHTML = times.length ? `<div class="stop-card" style="margin:4px 0 8px">${times.slice(0, 3).map(depRow).join("")}</div>` : `<p class="small muted" style="margin:2px 0 8px">${t("no_live_here")}</p>`;
  } catch { const b = $("#ls" + k); if (b) b.innerHTML = `<p class="small muted">${t("err_title")}</p>`; }
}

function lineFC(ids) { return { type: "FeatureCollection", features: networkFC().features.filter(f => ids.includes(f.properties.id)) }; }
function renderNetLine(el) {
  const L = lineById[S.params.id], bi = S.params.branch || 0, br = L.branches[bi];
  const maxHw = Math.max(...L.headways.filter(Boolean), 1); const bands = NET.timeBands.map(([a, b]) => `${String(a).padStart(2, "0")}–${String(b).padStart(2, "0")}`);
  el.innerHTML = `${backBtn("to-lines")}<div class="row" style="gap:12px;margin:4px 0">${chip(lineName(L), L.color, L.mode)}<h2 class="title" style="margin:0;font-size:19px;flex:1;min-width:0">${esc(lineTermini(L))}</h2></div>
    <p class="muted small" style="margin:0 0 12px">${esc(cityById[cityOf(L.id)].operator)} · ${t(L.mode)}</p>
    <div class="kv"><div><b class="tnum">${L.firstDep != null ? secOfDay(L.firstDep) : "–"}</b><span>${t("first")}</span></div><div><b class="tnum">${L.lastDep != null ? secOfDay(L.lastDep) : "–"}</b><span>${t("last")}</span></div><div><b class="tnum">${nf(new Set(L.branches.flat()).size)}</b><span>${t("stations")}</span></div></div>
    <h3 class="sub">${t("frequency")}</h3><div class="bars" style="--c:#${L.color}">${L.headways.map((h, i) => `<div><b class="tnum">${h ? nf(Math.round(h)) + "′" : "–"}</b><span class="b" style="height:${h ? Math.max(8, (1 - (h - 1) / (maxHw + 2)) * 60 + 8) : 3}px;${h ? "" : "background:var(--surface-3)"}"></span><span class="tnum">${bands[i]}</span></div>`).join("")}</div>
    <p class="est" style="margin:4px 0 0">${t("ref_day", { d: new Intl.DateTimeFormat(locale(), { dateStyle: "medium", timeZone: "UTC" }).format(new Date(cityById[cityOf(L.id)].source.referenceDay)) })}</p>
    ${L.branches.length > 1 ? `<h3 class="sub">${t("branch")}</h3><div class="chips">${L.branches.map((b, k) => `<button class="chip" data-branch="${k}" aria-pressed="${k === bi}">${esc(stations[b[b.length - 1]].name)}</button>`).join("")}</div>` : ""}
    <h3 class="sub">${t("stations")}</h3><ol class="diagram" style="--c:#${L.color}">${br.map(sid => { const st = stations[sid]; const others = new Set(st.lines.filter(x => x !== L.id)); for (const tr of transfersAt[sid] || []) for (const x of stations[tr.to].lines) if (x !== L.id) others.add(x); const ox = [...others].map(x => lineById[x]).filter(x => x.mode !== "tram" || L.mode === "tram").slice(0, 6);
      return `<li><span class="rail"><i class="${ox.length ? "x" : ""}"></i></span><button data-station="${sid}"><span style="font-weight:${ox.length ? 700 : 500}">${esc(st.name)}</span>${ox.length ? `<span class="xs">${ox.map(x => chip(lineName(x), x.color, x.mode, true)).join("")}</span>` : ""}</button></li>`; }).join("")}</ol>`;
  clearMarkers(); setFocus(lineFC([L.id]));
  for (const sid of br) { const st = stations[sid]; const mk = addMarker(st.lat, st.lon, "mk-end", "", () => go("lines", "station", { sid, fromLine: L.id }), st.name); Object.assign(mk.style, { width: "12px", height: "12px", borderWidth: "3px", borderColor: "#" + L.color }); }
  fit(br.map(s => [stations[s].lat, stations[s].lon]), 15);
}
async function renderStation(el) {
  const sid = S.params.sid, st = stations[sid]; const L0 = lineById[st.lines[0]];
  const xs = (transfersAt[sid] || []).map(tr => ({ ...tr, st: stations[tr.to] }));
  el.innerHTML = `${backBtn("to-line")}<h2 class="title">${esc(st.name)}</h2><p class="muted small" style="margin:-6px 0 8px">${t("station")} · ${esc(cityById[cityOf(sid)].name)}</p>
    <div class="row">${st.lines.map(id => `<button class="iconbtn" style="min-width:auto;padding:0 2px" data-line="${id}">${chip(lineName(lineById[id]), lineById[id].color, lineById[id].mode)}</button>`).join("")}</div>
    <h3 class="sub">${t("next_dep")}</h3><div id="stDeps"><div class="skel"></div></div>
    ${xs.length ? `<h3 class="sub">${t("interchange")}</h3><div class="list">${xs.map(x => `<button class="line-row" data-station="${x.to}"><span class="row" style="gap:4px">${x.st.lines.slice(0, 4).map(id => chip(lineName(lineById[id]), lineById[id].color, lineById[id].mode, true)).join("")}</span><span style="flex:1;min-width:0"><span class="t" style="display:block">${esc(x.st.name)}</span><span class="s">${t("walk_to", { t: nf(Math.max(1, Math.round(x.w / 60))) })} · ${fmtDist(x.d)}</span></span></button>`).join("")}</div>` : ""}
    <div class="row" style="margin-top:16px"><button class="btn tonal" data-act="st-from">${t("from")}: ${esc(st.name)}</button><button class="btn tonal" data-act="st-to">${t("to")}: ${esc(st.name)}</button></div>`;
  clearMarkers(); setFocus(lineFC(st.lines)); addMarker(st.lat, st.lon, "mk-stop sel", modeIcon(L0.mode)); flyTo(st.lat, st.lon, 15.5);
  // live departures from the matching Transitous stops
  const box = () => $("#stDeps"); const keep = S.params.sid;
  try {
    const d = 0.0018; const raw = await api.get("/api/v1/map/stops", { min: `${st.lat - d},${st.lon - d}`, max: `${st.lat + d},${st.lon + d}` }, { ttl: 300 });
    const wantModes = new Set(st.lines.map(id => ({ metro: "SUBWAY", tram: "TRAM", rail: "RAIL", funicular: "FUNICULAR" }[lineById[id].mode])));
    const cands = raw.filter(s => hav([st.lat, st.lon], [s.lat, s.lon]) < 200 && (s.modes || []).some(m => wantModes.has(m) || (m.includes("RAIL") && wantModes.has("RAIL")))).sort((a, b) => hav([st.lat, st.lon], [a.lat, a.lon]) - hav([st.lat, st.lon], [b.lat, b.lon]));
    const ids = [...new Set(cands.map(s => s.parentId || s.stopId))].slice(0, 2);
    const all = (await Promise.all(ids.map(id => api.get("/api/v1/stoptimes", { stopId: id, n: 10 }).then(r => r.stopTimes || []).catch(() => [])))).flat();
    const seen = new Set(); const times = all.filter(x => { const k = x.tripId + x.place.departure; if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => new Date(a.place.departure) - new Date(b.place.departure)).slice(0, 8);
    if (S.params.sid !== keep || !box()) return;
    if (!times.length) throw new Error("none");
    S.tripRefs = []; box().innerHTML = `<div class="stop-card">${times.map(depRow).join("")}</div>`;
  } catch {
    if (S.params.sid !== keep || !box()) return;
    const p = romeParts(new Date()); const sec = p.h * 3600 + p.mi * 60; const dirs = [];
    for (const id of st.lines) { const L = lineById[id]; const hw = headwayAt(L, sec); const ends = new Set(); for (const b of L.branches) { const i = b.indexOf(sid); if (i < 0) continue; if (i < b.length - 1) ends.add(b[b.length - 1]); if (i > 0) ends.add(b[0]); } for (const e of ends) dirs.push({ L, to: stations[e].name, hw }); }
    box().innerHTML = `<div class="stop-card">${dirs.map(d => `<div class="dep">${chip(lineName(d.L), d.L.color, d.L.mode)}<div class="hd">${t("towards")} ${esc(d.to)}<small>${t("est")}</small></div><div class="tm small">${d.hw ? t("every", { m: nf(Math.round(d.hw)) }) : t("no_service")}</div></div>`).join("")}</div>`;
  }
}

/* ================= saved / more ================= */
function renderSaved(el) {
  const slot = (k, ic) => { const p = S[k]; return `<div class="set"><span style="width:40px;height:40px;border-radius:50%;background:var(--brand-soft);color:var(--on-brand-soft);display:grid;place-items:center">${ic.replace("<svg", '<svg width="20" height="20"')}</span><span class="t"><b>${t(k)}</b><small>${p ? esc(p.name) : t("set_from_search")}</small></span>${p ? `<button class="btn text" data-act="go-${k}">${t("to")}</button>` : ""}</div>`; };
  el.innerHTML = `<h2 class="title">${t("saved_title")}</h2>${slot("home", I.home)}${slot("work", I.work)}
    ${S.to ? `<div class="row" style="margin-top:12px"><span class="muted small">${t("save_as")}: <b>${esc(S.to.name)}</b></span><button class="chip" data-act="save-home">${I.home}${t("home")}</button><button class="chip" data-act="save-work">${I.work}${t("work")}</button></div>` : ""}
    <h3 class="sub">${t("recent")}</h3>${S.recents.length ? `<div class="list">${S.recents.map((r, i) => `<button class="line-row" data-act="recent" data-i="${i}">${I.clock.replace("<svg", '<svg width="20" height="20"')}<span class="t">${esc(r.from.name)} → ${esc(r.to.name)}</span></button>`).join("")}</div>` : `<div class="empty">${I.clock}<b>${t("recent")}</b>${t("no_recent")}</div>`}`;
  clearMarkers(); showMe();
}
function renderMore(el) {
  if (S.view === "tickets") return renderTickets(el);
  if (S.view === "alerts") return renderAlerts(el);
  if (S.view === "privacy") return renderPrivacy(el); if (S.view === "attr") return renderAttr(el);
  const opt = (name, cur, list) => `<div class="seg" role="group" aria-label="${t(name)}" style="flex:none">${list.map(([v, l]) => `<button data-set="${name}" data-v="${v}" aria-pressed="${cur === v}">${l}</button>`).join("")}</div>`;
  el.innerHTML = `<h2 class="title">${t("settings")}</h2>
    <div class="set" style="flex-wrap:wrap"><span class="t"><b>${t("language")}</b></span>${opt("language", S.langPref, [["system", t("system")], ["en", "English"], ["it", "Italiano"]])}</div>
    <div class="set" style="flex-wrap:wrap"><span class="t"><b>${t("theme")}</b></span>${opt("theme", S.themePref, [["system", t("system")], ["light", t("light")], ["dark", t("dark")]])}</div>
    <label class="set"><span class="t"><b>${t("crash")}</b><small>${t("crash_s")}</small></span><span class="switch"><input type="checkbox" id="crashSw" ${S.crash ? "checked" : ""}><span></span></span></label>
    <label class="set"><span class="t"><b>${t("sim_off")}</b><small>${t("sim_off_s")}</small></span><span class="switch"><input type="checkbox" id="offSw" ${S.simOffline ? "checked" : ""}><span></span></span></label>
    <a class="linkrow" href="https://scioperi.mit.gov.it/mit2/public/scioperi" target="_blank" rel="noopener">${I.warn}<span style="flex:1"><b>${t("strikes")}</b><br><span class="muted small">scioperi.mit.gov.it</span></span>${I.ext}</a>
    <button class="linkrow" data-act="open-tickets"><span style="flex:1"><b>${t("ticket_prices")}</b></span>${I.chev}</button>
    <button class="linkrow" data-act="open-alerts"><span style="flex:1"><b>${t("service_alerts")}</b>${S.alerts.size ? ` <span class="muted small">(${nf(S.alerts.size)})</span>` : ""}</span>${I.chev}</button>
    <h3 class="sub">${t("saved_places")}</h3>
    ${[["home", I.home], ["work", I.work]].map(([k, ic]) => `<div class="set"><span style="width:40px;height:40px;border-radius:50%;background:var(--brand-soft);color:var(--on-brand-soft);display:grid;place-items:center;flex:none">${ic.replace("<svg", '<svg width="20" height="20"')}</span><span class="t"><b>${t(k)}</b><small>${S[k] ? esc(S[k].name) : t("set_hint")}</small></span>${S[k] ? `<button class="btn text" data-act="rm-${k}">${t("remove")}</button>` : ""}</div>`).join("")}
    ${installEvt ? `<button class="linkrow" data-act="install"><span style="flex:1"><b>${t("install")}</b><br><span class="muted small">${t("install_s")}</span></span>${I.chev}</button>` : ""}
    <h3 class="sub">${t("about")}</h3>
    <button class="linkrow" data-act="privacy"><span style="flex:1"><b>${t("privacy")}</b></span>${I.chev}</button>
    <button class="linkrow" data-act="attr"><span style="flex:1"><b>${t("attributions")}</b></span>${I.chev}</button>
    <p class="muted small" style="margin-top:16px">ItaliaNow 0.1.0 · MIT License · API: ${esc(CFG.API_BASE.replace(/^https?:\/\//, ""))}</p>`;
  $("#crashSw").onchange = e => { S.crash = e.target.checked; store.set("crash", S.crash); };
  $("#offSw").onchange = e => { S.simOffline = e.target.checked; store.set("simOffline", S.simOffline); S.apiDown = false; renderBadge(); };
  clearMarkers(); showMe();
}
function renderPrivacy(el) {
  const it = lang() === "it";
  el.innerHTML = `${backBtn("to-more")}<h2 class="title">${t("privacy")}</h2><div class="prose">${it ? `
    <p>ItaliaNow non usa tracciamento, pubblicità né profilazione. Questa informativa segue il Regolamento (UE) 2016/679 (GDPR).</p><h4>Dati sul dispositivo</h4><p>Luoghi preferiti, ricerche recenti e impostazioni restano solo sul tuo dispositivo.</p>
    <h4>Posizione</h4><p>Letta solo se la consenti, per mostrare le fermate vicine e come partenza dei viaggi. Viene inviata solo nelle richieste di percorso e di fermate vicine a Transitous e mai salvata.</p>
    <h4>Servizi esterni</h4><p>Ricerche di percorsi, fermate e indirizzi: Transitous (api.transitous.org). Mappe: fornitore di tessere. Nessuno riceve un identificativo personale.</p>
    <h4>Segnalazioni di arresto</h4><p>Disattivate per impostazione predefinita. Se attivate, rapporti anonimi vanno a Sentry (UE). Base giuridica: consenso (art. 6.1.a), revocabile.</p><h4>I tuoi diritti</h4><p>Accesso, rettifica, cancellazione, opposizione e reclamo al Garante privacy.</p>` : `
    <p>ItaliaNow has no tracking, ads or profiling. This policy follows the EU General Data Protection Regulation (GDPR).</p><h4>Data on your device</h4><p>Favourite places, recent searches and settings stay on your device only.</p>
    <h4>Location</h4><p>Read only if you allow it, to show nearby stops and to start your journeys. It is sent only inside nearby-stop and route requests to Transitous and is never stored.</p>
    <h4>Outside services</h4><p>Route, stop and address searches: Transitous (api.transitous.org). Maps: the tile provider. Neither receives a personal identifier.</p>
    <h4>Crash reports</h4><p>Off by default. If you turn them on, anonymous reports go to Sentry (EU region). Legal basis: consent (Art. 6(1)(a)), which you can withdraw.</p><h4>Your rights</h4><p>Access, correction, deletion, objection, and complaint to your data protection authority.</p>`}</div>`;
}
function renderAttr(el) {
  el.innerHTML = `${backBtn("to-more")}<h2 class="title">${t("attributions")}</h2>
    <div class="attr"><b>Transitous</b>${lang() === "it" ? "Calcolo percorsi, ricerca e tempo reale." : "Journey planning, search and real time."} <a href="https://transitous.org" target="_blank" rel="noopener">transitous.org</a></div>
    <div class="attr"><b>© OpenStreetMap contributors</b>ODbL 1.0 · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">openstreetmap.org/copyright</a></div>
    <div class="attr"><b>${CFG.MAPTILER_KEY ? "© MapTiler" : "© CARTO"}</b>${lang() === "it" ? "Stile mappa" : "Map style"}</div>
    <div class="attr"><b>MapLibre GL JS</b>BSD-3-Clause</div><div class="attr"><b>MOTIS</b>MIT License</div>
    ${NET.cities.map(c => `<div class="attr"><b>${esc(c.operator)} — GTFS</b>${t("license")}: ${esc(c.source.license)} · <a href="${esc(c.source.licenseUrl)}" target="_blank" rel="noopener">${t("open_link")}</a></div>`).join("")}`;
}

/* ================= router / events ================= */
const body = $("#body");
function go(tab, view = null, params = {}) { S.tab = tab; S.view = view; S.params = params; render(); }
function render() {
  renderNav(); renderBadge(); renderStrike();
  if (!["nearby", "home"].includes(S.tab) || S.view) $("#hereBtn").hidden = true;
  if (!(S.tab === "plan" && (S.view === "results" || S.view === "detail"))) setJourney(emptyFC);
  if (!(S.tab === "lines" && S.view)) setFocus(emptyFC);
  if (!(S.tab === "lines" && S.view === "lx") && S.lineFocus) { S.lineFocus = null; drawVehicles(); }
  const v = S.view === "trip" ? renderTrip : S.view === "stop" ? renderStop : { home: renderHome, nearby: renderNearby, plan: renderPlan, lines: renderLines, more: renderMore }[S.tab];
  body.innerHTML = ""; const el = document.createElement("div"); el.className = "fade-in"; body.appendChild(el); v(el);
}
let toastT;
function toast(msg) { clearTimeout(toastT); const o = $("#overlay"); if (o.querySelector(".onboard")) return; o.innerHTML = `<div class="toast" role="status">${esc(msg)}</div>`; toastT = setTimeout(() => { if (!o.querySelector(".onboard")) o.innerHTML = ""; }, 2800); }
app.addEventListener("click", async e => {
  const b = e.target.closest("button,[data-act]"); if (!b) return; const d = b.dataset;
  if (d.obLang) { S.langPref = d.obLang; store.set("lang", d.obLang); document.documentElement.lang = lang(); showOnboarding(); return; }
  if (d.tab) { S.focus = null; go(d.tab); if (d.tab === "nearby" || d.tab === "home") { const c = S.nearby.center || S.me || CFG.DEFAULT_CENTER; flyTo(c[0], c[1], 16); if (!S.nearby.updated || Date.now() - S.nearby.updated > 20000) loadNearby(c); } return; }
  if (d.mode) { S.modeFilter = d.mode; store.set("modeFilter", d.mode); applyVehicleFilter(); return render(); }
  if (d.trip) { const ref = S.tripRefs[+d.trip]; if (!ref?.tripId) return; S.prev = { tab: S.tab, view: S.view, params: S.params }; return go(S.tab, "trip", { ref, back: "trip-back" }); }
  if (d.city) { S.linesCity = d.city; S.lineQ = ""; S.linesShown = 60; return render(); }
  if (d.st) { S.stationsTab = d.st; return render(); }
  if (d.tcity) { S.params.city = d.tcity; return render(); }
  if (d.ltab) { S.lineTab = d.ltab; S.linesShown = 60; [...document.querySelectorAll("[data-ltab]")].forEach(x => x.setAttribute("aria-selected", x === b)); return fillLineList(); }
  if (d.lr) { const [city, i] = d.lr.split("|"); const r = LIDX[city]?.routes[+i]; if (!r) return; const k = lineKey(city, r); S.recentLines = [k, ...S.recentLines.filter(x => x !== k)].slice(0, 12); store.set("recentLines", S.recentLines); S.tripRefs = []; return go("lines", "lx", { city, i: +i, dir: 0 }); }
  if (d.dir) { S.params.dir = +d.dir; return render(); }
  if (d.ls) return showLineStop(+d.ls);
  if (d.line) { S.linesCity = cityOf(d.line); return go("lines", "line", { id: d.line, branch: 0 }); }
  if (d.branch) { S.params.branch = +d.branch; return render(); }
  if (d.station) return go("lines", "station", { sid: d.station, fromLine: S.params.id || S.params.fromLine });
  if (d.time) { S.timeMode = d.time; if (!S.timeVal) S.timeVal = defaultTimeVal(); return render(); }
  if (d.pref) { S.pref = d.pref; if (S.view === "results") { S.planResult = null; render(); runPlan(); return; } return render(); }
  if (d.set === "language") { S.langPref = d.v; store.set("lang", d.v); document.documentElement.lang = lang(); return render(); }
  if (d.set === "theme") { S.themePref = d.v; store.set("theme", d.v); applyTheme(); return render(); }
  switch (d.act) {
    case "ob-allow": store.set("onboarded", true); return startWithLocation(true);
    case "ob-skip": store.set("onboarded", true); S.locState = "denied"; return startWithLocation(false);
    case "ob-privacy": e.preventDefault(); store.set("onboarded", true); $("#overlay").innerHTML = ""; go("more", "privacy"); loadNearby(CFG.DEFAULT_CENTER); return;
    case "pick": { const p = $("#sugg")._res[+d.i]; const tgt = S.focus === "toIn" ? "to" : "from"; S[tgt] = { ...p }; S.focus = null; if (S.from && S.to) return doSearch(); render(); setTimeout(() => $(tgt === "from" ? "#toIn" : "#fromIn")?.focus(), 0); return; }
    case "swap": [S.from, S.to] = [S.to, S.from]; return render();
    case "search": { const ti = $("#timeIn"); if (ti) S.timeVal = ti.value; return doSearch(); }
    case "retry-plan": S.apiDown = false; S.planResult = null; render(); return runPlan();
    case "recent": { const r = S.recents[+d.i]; S.from = r.from; S.to = r.to; S.tab = "plan"; return doSearch(); }
    case "myloc": { if (!S.me) { await getLocation(); if (S.me) { showMe(); watchLocation(); } } if (!S.me) { toast(t("loc_denied")); return; } S[S.from ? "to" : "from"] = { kind: "me", name: t("my_location"), lat: S.me[0], lon: S.me[1] }; if (S.from && S.to) return doSearch(); return render(); }
    case "pickmap": S.picking = S.from ? "to" : "from"; toast(t("pick_hint")); setSnap(0); return;
    case "detail": return go("plan", "detail", { i: +d.i });
    case "to-plan": return go("plan");
    case "to-results": return go("plan", "results");
    case "to-nearby": return go("nearby");
    case "trip-back": { const p = S.prev || { tab: "nearby" }; S.prev = null; return go(p.tab, p.view, p.params); }
    case "retry-trip": S.apiDown = false; return render();
    case "nearby-retry": S.apiDown = false; return loadNearby(S.nearby.center);
    case "open-stop": { const st = stopSrc[+d.i]; if (!st) return; S.prevStop = { tab: S.tab, view: S.view, params: S.params }; return go(S.tab, "stop", { s: st }); }
    case "stop-back": { const p = S.prevStop || { tab: S.tab }; S.prevStop = null; return go(p.tab, p.view, p.params); }
    case "fav-stop": { const st = stopSrc[+d.i]; if (!st) return; const id = stopKey(st);
      if (S.favStops.some(f => f.id === id)) S.favStops = S.favStops.filter(f => f.id !== id);
      else { S.favStops = [...S.favStops, { id, name: titleish(st.name), lat: st.lat, lon: st.lon, modes: st.modes || [], stopCode: st.stopCode || "" }]; S.favData[id] = st.times || undefined; }
      store.set("favStops", S.favStops); return render(); }
    case "fav-line": { const { city, i } = S.params; const k = lineKey(city, LIDX[city].routes[i]); S.favLines = S.favLines.includes(k) ? S.favLines.filter(x => x !== k) : [...S.favLines, k]; store.set("favLines", S.favLines); return render(); }
    case "open-tickets": return go("more", "tickets", { back: S.tab === "home" ? "to-home" : "to-more" });
    case "to-home": return go("home");
    case "open-alerts": return go("more", "alerts", { back: S.tab === "home" ? "to-home" : "to-more" });
    case "clear-recent-lines": S.recentLines = S.recentLines.filter(k => !k.startsWith(S.linesCity + "|")); store.set("recentLines", S.recentLines); return fillLineList();
    case "more-lines": S.linesShown += 100; return fillLineList();
    case "lines-retry": return render();
    case "stop-from": case "stop-to": { const s = S.params.s; S[d.act === "stop-from" ? "from" : "to"] = { kind: "stop", id: s.parentId || s.stopId, name: titleish(s.name), lat: s.lat, lon: s.lon }; return go("plan"); }
    case "to-lines": return go("lines");
    case "to-line": return S.params.fromLine ? go("lines", "line", { id: S.params.fromLine, branch: 0 }) : go("lines");
    case "to-more": return go("more");
    case "privacy": return go("more", "privacy");
    case "attr": return go("more", "attr");
    case "st-from": case "st-to": { const st = stations[S.params.sid]; S[d.act === "st-from" ? "from" : "to"] = { kind: "station", sid: S.params.sid, name: st.name, lat: st.lat, lon: st.lon }; return go("plan"); }
    case "use-home": S[S.from ? "to" : "from"] = S.home; return render();
    case "use-work": S[S.from ? "to" : "from"] = S.work; return render();
    case "save-home": S.home = S.to; store.set("home", S.home); return render();
    case "save-work": S.work = S.to; store.set("work", S.work); return render();
    case "go-home": case "go-work": { S.to = d.act === "go-home" ? S.home : S.work; if (S.me) S.from = { kind: "me", name: t("my_location"), lat: S.me[0], lon: S.me[1] }; S.tab = "plan"; if (S.from && S.to) return doSearch(); return go("plan"); }
    case "where-to": { S.tab = "plan"; S.view = null; if (S.me && !S.from) S.from = { kind: "me", name: t("my_location"), lat: S.me[0], lon: S.me[1] }; S.to = null; render(); setSnap(2); setTimeout(() => $("#toIn")?.focus(), 50); return; }
    case "hint-home": toast(t("set_hint")); return;
    case "rm-home": S.home = null; store.set("home", null); return render();
    case "rm-work": S.work = null; store.set("work", null); return render();
    case "install": if (installEvt) { installEvt.prompt(); installEvt = null; render(); } return;
    case "share": { const R = S.planResult; const it = R?.live ? R.its[S.params.i] : null;
      const text = `${S.from.name} → ${S.to.name}` + (it ? `\n${fmtTime(new Date(it.startTime))}–${fmtTime(new Date(it.endTime))} · ${fmtDur(it.duration)} · ` + it.legs.filter(l => l.mode !== "WALK").map(l => liveName(l.displayName || l.routeShortName)).join(" → ") : "");
      try { if (navigator.share) await navigator.share({ title: "ItaliaNow", text, url: location.href }); else { await navigator.clipboard.writeText(text + "\n" + location.href); toast(t("copied")); } } catch {}
      return; }
    case "dismiss-strike": S.strikeDismissed = true; return renderStrike();
  }
});
$("#hereBtn").addEventListener("click", () => { const c = map.getCenter(); loadNearby([c.lat, c.lng]); });
$("#locate").addEventListener("click", async () => { if (!S.me) { await getLocation(); if (S.me) watchLocation(); else { toast(t("loc_denied")); return; } } showMe(); flyTo(S.me[0], S.me[1], 16); if (S.tab === "nearby" && !S.view) loadNearby(S.me); });

function applyTheme() {
  const r = document.documentElement; if (S.themePref === "system") r.removeAttribute("data-theme"); else r.setAttribute("data-theme", S.themePref);
  document.querySelector('meta[name="theme-color"]').content = isDark() ? "#151B18" : "#0B6B4F"; refreshMapStyle();
}
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", applyTheme);

/* ================= installable app ================= */
let installEvt = null;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; if (S.tab === "more") render(); });
if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});

/* ================= boot ================= */
(async () => {
  document.documentElement.lang = lang(); applyTheme(); renderNav(); renderBadge(); setSnap(1);
  await loadNetwork(); initMap();
  S.tab = "home"; render();
  let perm = null; try { perm = (await navigator.permissions?.query({ name: "geolocation" }))?.state; } catch {}
  if (perm === "granted") startWithLocation(true);
  else if (perm === "denied") { S.locState = "denied"; startWithLocation(false); }
  else if (!store.get("onboarded", false)) showOnboarding();
  else startWithLocation(true);
})();
})();
