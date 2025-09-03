import React, { useMemo, useState, useEffect } from "react";
import { extractVillaKey, normalizeAvailability } from "./idUtil";

const COLOR_AVAILABLE = "rgba(15,255,255,0.35)";
const COLOR_SOLD = "rgba(200,0,0,0.35)";

function titleForId(id) {
  const s = String(id || "");
  if (/CLUBHOUSE/i.test(s)) return "Clubhouse";
  if (/CANAL|LANDSCAPE/i.test(s)) return "Canal/Landscaping Zone";
  const k = extractVillaKey(s);
  return k ? `Villa No ${k}` : s.replace(/_/g, "");
}

export default function MasterPlan({ svgUrl, sheetRows = [] }) {
  const [activeId, setActiveId] = useState(null);

  const byKey = useMemo(() => {
    const m = new Map();
    for (const r of sheetRows) {
      const key = String(r.id ?? r.villa ?? "").toUpperCase().trim();
      if (!key) continue;
      m.set(key, {
        villaKey: key,
        facing: r.facing ?? r.face ?? "",
        sqft: r.sqft ?? r.SqFt ?? r.SFT ?? "",
        plotSize: r.plotSize ?? r.SqYds ?? r.SqYrs ?? "",
        availability: normalizeAvailability(r.availability ?? r.Status ?? "")
      });
    }
    return m;
  }, [sheetRows]);

  useEffect(() => {
    console.log("[rows]", sheetRows.length);
  }, [sheetRows]);

  useEffect(() => {
    const onOver = (e) => {
      const target = e.target;
      if (!(target instanceof SVGElement)) return;
      const id = target.getAttribute("id");
      if (!id) return;
      setActiveId(id);
    };
    const onOut = (e) => {
      setActiveId(null);
    };
    const svg = document.querySelector("object#plan");
    const attach = () => {
      const doc = svg?.contentDocument;
      if (!doc) return;
      doc.addEventListener("mouseover", onOver);
      doc.addEventListener("mouseout", onOut);
    };
    svg?.addEventListener("load", attach);
    attach();
    return () => {
      const doc = svg?.contentDocument;
      doc?.removeEventListener("mouseover", onOver);
      doc?.removeEventListener("mouseout", onOut);
      svg?.removeEventListener("load", attach);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a0a", color: "#fff" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <object id="plan" type="image/svg+xml" data={svgUrl} style={{ width: "100%", height: "100%" }} />
      </div>
      {activeId && (
        <div style={{ position: "absolute", left: 16, bottom: 16, background: "rgba(0,0,0,0.72)", padding: 12, borderRadius: 10 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>{titleForId(activeId)}</div>
          <div>Hovering</div>
        </div>
      )}
    </div>
  );
}
