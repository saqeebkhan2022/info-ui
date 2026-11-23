export const titles = {
  dashboard: "Dashboard",
  operations: "Client operations",
  clients: "Client directory",
  pools: "Pools",
  brokers: "Brokers",
  users: "User management",
  roles: "Roles",
};
export const labels = {
  id: "ID",
  name: "Name",
  email: "Email",
  phone: "Phone number",
  password: "Password",
  profile: "Access profile",
  active: "Status",
  role: "Role",
  role_id: "Role",
  color: "Display color",
  client_id: "Client",
  pool_id: "Pool",
  broker_id: "Broker",
  retainer_id: "Retainer",
  manager_id: "Manager",
  account_no: "MT5 / Account ID",
  platform: "Platform",
  trading_type: "Trading type",
  first_deposit: "First deposit",
  re_deposit: "Re-deposit",
  withdrawal: "Withdrawal",
  created_at: "Created (Dubai)",
  from: "From date",
  to: "To date",
  entry: "Entry type",
  oldPassword: "Current password",
};
export const label = (k) => labels[k] || k.charAt(0).toUpperCase() + k.slice(1);
export const fields = {
  clients: ["name", "phone", "email"],
  pools: ["name", "color"],
  brokers: ["name", "color"],
  roles: ["name", "profile"],
  users: ["name", "email", "password", "role_id", "active"],
  operations: [
    "client_id",
    "pool_id",
    "broker_id",
    "retainer_id",
    "manager_id",
    "account_no",
    "platform",
    "trading_type",
    "first_deposit",
    "re_deposit",
    "withdrawal",
  ],
};
export const columns = {
  clients: ["id", "name", "phone", "email", "created_at"],
  users: ["id", "name", "email", "role", "active", "created_at"],
  roles: ["name", "profile"],
  pools: ["name", "color"],
  brokers: ["name", "color"],
  operations: [
    "client",
    "account_no",
    "email",
    "pool",
    "broker",
    "manager",
    "retainer",
    "first_deposit",
    "re_deposit",
    "withdrawal",
    "trading_type",
    "platform",
    "created_at",
    "phone",
  ],
};
export const money = ["first_deposit", "re_deposit", "withdrawal"];
export const dollars = (v) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    v || 0,
  );
export function choices(k, lookups) {
  const tables = {
    role_id: "roles",
    client_id: "clients",
    pool_id: "pools",
    broker_id: "brokers",
    retainer_id: "retainers",
    manager_id: "managers",
  };
  if (tables[k]) return lookups[tables[k]] || [];
  const options = {
    profile: ["Manager", "Retainer"],
    trading_type: ["Standard", "VIP", "Islamic", "Raw"],
    entry: money,
    active: ["true", "false"],
  };
  return options[k]?.map((id) => ({
    id,
    name:
      k === "active"
        ? id === "true"
          ? "Active"
          : "Disabled"
        : k === "entry"
          ? label(id)
          : id,
  }));
}
