export async function fetchPlots() {
  const url = "/api/plots";
  const r = await fetch(url, { credentials: "omit" });
  const text = await r.text();
  if (!r.ok) throw new Error("HTTP " + r.status + "\n\n" + text);
  const json = JSON.parse(text);
  return Array.isArray(json.rows) ? json.rows : json;
}
