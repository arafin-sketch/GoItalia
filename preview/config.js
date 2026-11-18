// ItaliaNow runtime configuration. Switch API_BASE to your own MOTIS server for commercial use.
window.ITALIANOW_CONFIG = {
  API_BASE: "https://api.transitous.org",
  // Map styles. With a MapTiler key the app uses MapTiler Streets (light) and Dataviz Dark;
  // without one it uses the free CARTO Positron / Dark Matter vector styles.
  MAPTILER_KEY: "",
  STYLE_LIGHT: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  STYLE_DARK: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  NEARBY_RADIUS_M: 500,
  REFRESH_SECONDS: 30,
  REQUEST_TIMEOUT_MS: 12000,
  CACHE_SECONDS: 25,
  MAX_PARALLEL_REQUESTS: 2,
  DEFAULT_CENTER: [41.8902, 12.4922], // Colosseo, used when location is off
};
