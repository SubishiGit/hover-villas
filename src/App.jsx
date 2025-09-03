import React, { useEffect, useState } from "react";
import { fetchPlots } from "./api";
import MasterPlan from "./MasterPlan";

export default function App() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPlots()
      .then((data) => setRows(data))
      .catch((e) => setErr(String(e?.message || e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "#fff", padding: 20 }}>Loading…</div>;
  if (err) return <div style={{ color: "tomato", padding: 20 }}>Failed to load data: {err}</div>;

  return <MasterPlan svgUrl="/map.svg" sheetRows={rows} />;
}
