import {panelSurface,primaryButton} from "../themeClasses";
import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { titles, fields, columns } from "../services/modules";
import Field from "../components/Field";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import {Pencil, Trash2} from "lucide-react";
import Stats from "../components/Stats";
const singular = {
  users: "user",
  roles: "role",
  pools: "pool",
  brokers: "broker",
  clients: "client",
  operations: "operation",
};
const filters = {
  users: ["role_id", "active", "from", "to"],
  clients: ["from", "to"],
  roles: ["profile"],
  operations: [
    "from",
    "to",
    "pool_id",
    "broker_id",
    "manager_id",
    "retainer_id",
    "entry",
    "trading_type",
  ],
};
export default function RecordsPage({ kind, user, cardTitle, revision = 0, onChanged }) {
  const [page, setPage] = useState(1),
    [limit, setLimit] = useState(10),
    [query, setQuery] = useState({}),
    [draft, setDraft] = useState({});
  const [data, setData] = useState(null),
    [lookups, setLookups] = useState({}),
    [version, reload] = useState(0);
  const [modal, setModal] = useState(null),
    [form, setForm] = useState({}),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [formError, setFormError] = useState("");
  useEffect(() => {
    let live = true;
    setError("");
    setData(null);
    Promise.all([
      api(kind + "?" + new URLSearchParams({ ...query, page, limit })),
      api("lookups"),
    ])
      .then(([d, l]) => {
        if (live) {
          setData(d);
          setLookups(l);
        }
      })
      .catch((e) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, [kind, page, limit, query, version, revision]);
  const [filtersOpen,setFiltersOpen]=useState(false);
  const [linkedCount,setLinkedCount]=useState(null);
  const [previewVersion,setPreviewVersion]=useState(0);
  const clientDelete=kind==="clients" && modal==="delete";
  useEffect(()=>{
    if(!clientDelete) return;
    let live=true;
    api("clients/"+form.id+"/delete-preview").then(({count})=>{if(live)setLinkedCount(count)})
      .catch(e=>{if(live)setFormError(e.message)});
    return ()=>{live=false};
  },[clientDelete,form.id,previewVersion]);
  function open(mode, row) {
    setForm(
      row
        ? { ...row, password: "", ...(kind === "operations" ? {
            manager_id: lookups.managers?.some(x=>x.id===row.manager_id) ? row.manager_id : "",
            retainer_id: lookups.retainers?.some(x=>x.id===row.retainer_id) ? row.retainer_id : ""
          } : {}) }
        : {
            color: "#64748b",
            active: "true",
            trading_type: "Standard",
            retainer_id: user.profile === "Retainer" ? user.id : "",
            profile: "Retainer",
          },
    );
    setFormError("");
    setLinkedCount(null);
    setModal(mode);
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api(
        kind + (form.id ? "/" + form.id : ""),
        modal === "delete" ? "DELETE" : form.id ? "PUT" : "POST",
        modal === "delete" ? (clientDelete && linkedCount>0 ? {cascade:true,expectedCount:linkedCount} : {}) : form,
      );
      setModal(null);
      if (onChanged) onChanged(); else reload(version + 1);
    } catch (e) {
      setFormError(e.message);
      if(clientDelete){setLinkedCount(null);setPreviewVersion(v=>v+1)}
    } finally {
      setBusy(false);
    }
  }
  async function download() {
    try {
      const blob = await api("operations/export?" + new URLSearchParams(query));
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "Client-Operations.xlsx";
      a.click();
      setTimeout(() => URL.revokeObjectURL(href), 10000);
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <>
      <div className="toolbar">
        {cardTitle ? <h2>{cardTitle}</h2> : <h1>{titles[kind]}</h1>}
        <div className="flex gap-2">
          {kind === "operations" && (
            <button onClick={download}>Export Excel</button>
          )}
          <button className={primaryButton} onClick={() => open("edit")}>
            + Add {singular[kind]}
          </button>
        </div>
      </div>
      {kind === "operations" && data && <Stats data={data} />}
      <section className={"panel records "+panelSurface}>
        <form
          className="filters"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setQuery({ ...draft });
          }}
        >
          <label>
            Search
            <input
              type="search"
              placeholder={
                kind === "operations"
                  ? "Client, phone or account ID"
                  : "Search records…"
              }
              value={draft.search || ""}
              onChange={(e) => setDraft({ ...draft, search: e.target.value })}
            />
          </label>
          {filters[kind]?.length > 0 && <button type="button" aria-expanded={filtersOpen} aria-controls={kind+"-filters"} onClick={()=>setFiltersOpen(!filtersOpen)}>{filtersOpen?"Hide filters":"More filters"}</button>}
          <div className="filter-actions">
            <button>Apply filters</button>
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setDraft({});
                setQuery({});
              }}
            >
              Reset
            </button>
          </div>
          {filters[kind]?.length > 0 && <div hidden={!filtersOpen} className="filter-fields" id={kind+"-filters"}>
          {(filters[kind] || []).map((k) => (
            <Field
              key={k}
              name={k}
              value={draft[k]}
              filter
              multiple={["entry", "retainer_id"].includes(k)}
              lookups={lookups}
              onChange={(v) => setDraft({ ...draft, [k]: v })}
            />
          ))}
          </div>}
        </form>
        {error && <p role="alert">{error}</p>}
        {data ? (
          <>
            <DataTable
              columns={columns[kind]}
              rows={data.rows}
              actions={(r) => {
                const locked =
                  (kind === "roles" && r.builtin) ||
                  (kind === "users" &&
                    (r.id === user.id ||
                      (user.profile === "Manager" &&
                        r.profile !== "Retainer")));
                return locked ? (
                  <small>Protected</small>
                ) : (
                  <>
                    <button className="row-action" title="Edit" aria-label={"Edit "+(r.name||r.client||r.id)} onClick={() => open("edit", r)}><Pencil size={15}/></button>{" "}
                    {user.profile !== "Retainer" && (
                      <button className="row-action" title="Delete" aria-label={"Delete "+(r.name||r.client||r.id)} onClick={() => open("delete", r)}><Trash2 size={15}/></button>
                    )}
                  </>
                );
              }}
            />
            <Pagination
              page={data.page}
              total={data.total}
              limit={limit}
              change={setPage}
              resize={(v) => {
                setLimit(v);
                setPage(1);
              }}
            />
          </>
        ) : (
          !error && <p className="empty">Loading records…</p>
        )}
      </section>
      {modal && (
        <Modal
          title={
            (modal === "delete" ? "Delete" : form.id ? "Edit" : "Add") +
            " " +
            singular[kind]
          }
          close={() => !busy && setModal(null)}
        >
          <form onSubmit={save}>
            {modal === "delete" ? (
              <p>
                Delete {form.name || form.client || "this record"}?{" "}
                {kind === "users"
                  ? "Their sign-in access and role assignment will be removed."
                  : ""}
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {fields[kind].map((k) => (
                  <Field
                    key={k}
                    name={k}
                    lookups={lookups}
                    value={form[k]}
                    disabled={
                      k === "retainer_id" && user.profile === "Retainer"
                    }
                    required={
                      [
                        "name",
                        "phone",
                        "role_id",
                        "client_id",
                        "pool_id",
                        "broker_id",
                        "retainer_id",
                      ].includes(k) ||
                      (kind === "users" &&
                        (k === "email" || (k === "password" && !form.id)))
                    }
                    onChange={(v) => setForm({ ...form, [k]: v })}
                  />
                ))}
              </div>
            )}
            {clientDelete && linkedCount===null && !formError && <p role="status">Checking linked operations…</p>}
            {clientDelete && linkedCount>0 && <p role="note" className="mt-4 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
              This client has {linkedCount} linked {linkedCount===1?"operation":"operations"}, including any archived entries. Deleting the client will permanently delete these records and update reporting totals.
            </p>}
            {formError && <p role="alert">{formError}</p>}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                disabled={busy}
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button className={modal==="delete"?"rounded bg-red-700 px-4 py-2 !text-white hover:bg-red-800 dark:!bg-red-700":primaryButton} disabled={busy || (clientDelete && linkedCount===null)}>
                {busy ? "Saving…" : modal === "delete" ? (clientDelete && linkedCount>0?"Delete client and operations":"Delete") : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
