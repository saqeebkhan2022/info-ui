import React from "react";
import { label, money, dollars } from "../services/modules";

function cell(key, val) {
  if (key === "created_at") {
    if (!val) return "—";
    const date = new Date(val);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-GB", { timeZone: "Asia/Dubai" });
  }
  if (key === "color") return <span className="color-value"><i style={{ backgroundColor: val || "#94a3b8" }} />{val || "—"}</span>;
  if (key === "active") return <span className={`badge ${val ? "status-active" : "status-inactive"}`}>{val ? "Active" : "Disabled"}</span>;
  return money.includes(key) ? dollars(val) : (val ?? "—");
}
export default function DataTable({ columns = [], rows = [], actions }) {
  return (
    <div className="fit-table" role="region" aria-label="Records table" tabIndex={0}>
      <table>
        <thead><tr>{columns.map(k => <th scope="col" key={k}>{label(k)}</th>)}{actions && <th scope="col">Actions</th>}</tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={r.id ?? i}>
            {columns.map(k => <td key={k} data-label={label(k)}>{cell(k, r[k])}</td>)}
            {actions && <td className="table-actions" data-label="Actions"><div className="table-action-buttons">{actions(r)}</div></td>}
          </tr>
        ))}</tbody>
      </table>
      {!rows.length && <p className="empty">No records match this view.</p>}
    </div>
  );
}
