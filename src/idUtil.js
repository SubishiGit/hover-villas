export function extractVillaKey(id) {
  const s = String(id || "").toUpperCase();
  if (/CANAL|LANDSCAPE|CLUBHOUSE/.test(s)) return null;
  const m = s.match(/(^|[^0-9A-Z])([0-9]+[A-Z]?)(?![0-9A-Z])/);
  return m ? m[2] : null;
}
export function normalizeAvailability(av) {
  const v = String(av ?? "").trim();
  if (v === "2" || /^sold$/i.test(v)) return "Sold";
  if (v === "0" || /^available$/i.test(v) || /^premium$/i.test(v)) return "Available";
  return "Available";
}
