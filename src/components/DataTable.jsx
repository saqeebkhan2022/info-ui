import React from "react";
import { label, money, dollars } from "../services/modules";
function cell(key, val) {
  if (key === "created_at")
    return new Date(val).toLocaleString("en-GB", { timeZone: "Asia/Dubai" });
  if (key === "color")
    return (
      <>
        <i style={{ backgroundColor: val }} />
        {val}
      </>
    );
  if (key === "active")
    return <span className="badge">{val ? "Active" : "Disabled"}</span>;
  return money.includes(key) ? dollars(val) : val || "—";
}
export default function DataTable({ columns, rows, actions }) {
  return (
    <div className="fit-table">
      <table>
        <thead>
          <tr>
            {columns.map((k) => (
              <th key={k}>{label(k)}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id ?? i}>
              {columns.map((k) => (
                <td key={k} data-label={label(k)}>{cell(k, r[k])}</td>
              ))}
              {actions && <td data-label="Actions">{actions(r)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <p className="empty">No records match this view.</p>}
    </div>
  );
}
