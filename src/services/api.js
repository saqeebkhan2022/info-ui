const apiOrigin = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const endpoint = path => `${apiOrigin}/api/${path}`;
const logoutKey = "infopanel.logout";
const channel = typeof BroadcastChannel === "function" ? new BroadcastChannel(logoutKey) : null;
let generation = 0;
let refreshing;

function endLocalSession() {
  generation++;
  window.dispatchEvent(new Event("signed-out"));
}
if (channel) channel.onmessage = endLocalSession;
window.addEventListener("storage", event => {
  if (event.key === logoutKey && event.newValue) endLocalSession();
});
function notifyLogout() {
  endLocalSession();
  if (channel) channel.postMessage("logout");
  try { localStorage.setItem(logoutKey, String(Date.now())); } catch {}
}
function refresh() {
  if (!refreshing) {
    refreshing = fetch(endpoint("refresh"), {
      credentials: "include",
      method:"POST", headers:{"Content-Type":"application/json"}, body:"{}"
    }).finally(() => { refreshing = undefined; });
  }
  return refreshing;
}
export async function api(path, method = "GET", body) {
  const started = generation;
  const request = () => fetch(endpoint(path), {
    credentials: "include",
    method, headers:{"Content-Type":"application/json"},
    body:body === undefined ? undefined : JSON.stringify(body)
  });
  let response = await request();
  if (response.status === 401 && path !== "login" && started === generation) {
    const renewed = await refresh();
    if (renewed.ok && started === generation) response = await request();
    else response = renewed;
    if (response.status === 401 && started === generation) endLocalSession();
  }
  if (started !== generation) throw Error("Please sign in again.");
  if (!response.ok) throw Error((await response.json()).error || "Request failed.");
  const result = path.startsWith("operations/export") ? await response.blob() : await response.json();
  if (started !== generation) throw Error("Please sign in again.");
  if (path === "logout" || path === "password") notifyLogout();
  return result;
}
