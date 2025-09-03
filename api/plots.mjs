import { google } from "googleapis";

function ok(res, body) {
  res.setHeader("Content-Type", "application/json");
  res.status(200).end(JSON.stringify(body));
}
function fail(res, status, body) {
  res.setHeader("Content-Type", "application/json");
  res.status(status).end(JSON.stringify(body));
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return fail(res, 405, { error: "Method not allowed" });

    const keyB64 = process.env.GOOGLE_SA_BASE64 || "";
    const sheetId = process.env.SHEET_ID || "";
    const sheetRangeRaw = process.env.SHEET_RANGE || "Sheet1!A:B,Sheet1!D:F";
    if (!keyB64 || !sheetId) return fail(res, 500, { error: "Missing GOOGLE_SA_BASE64 or SHEET_ID" });

    const creds = JSON.parse(Buffer.from(keyB64, "base64").toString("utf8"));
    const auth = new google.auth.JWT(
      creds.client_email,
      null,
      creds.private_key,
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );
    const sheets = google.sheets({ version: "v4", auth });

    const ranges = sheetRangeRaw.split(",").map(s => s.trim()).filter(Boolean);
    const batch = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: sheetId,
      ranges
    });

    const vals = batch.data.valueRanges || [];
    const left = vals[0]?.values || [];
    const right = vals[1]?.values || [];

    const headerL = left[0] || [];
    const headerR = right[0] || [];

    const rowsL = left.slice(1);
    const rowsR = right.slice(1);

    const len = Math.max(rowsL.length, rowsR.length);
    const rows = [];
    for (let i = 0; i < len; i++) {
      const L = rowsL[i] || [];
      const R = rowsR[i] || [];
      rows.push({
        id: String(L[0] || "").trim(),
        facing: String(L[1] || "").trim(),
        sqft: String(R[0] || "").trim(),
        plotSize: String(R[1] || "").trim(),
        availability: String((R[3] ?? R[2] ?? "")).trim()
      });
    }

    ok(res, { rows });
  } catch (e) {
    fail(res, 500, { error: String(e && e.message || e) });
  }
}
