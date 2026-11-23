import MultiFilter from "./MultiFilter";
import React from "react";
import { choices, label, money } from "../services/modules";
export default function Field({
  name,
  value,
  onChange,
  lookups = {},
  filter = false,
  required = false,
  disabled = false,
  multiple = false,
}) {
  const options = choices(name, lookups);
  if(multiple) return <MultiFilter title={label(name)} value={value} onChange={onChange} options={options}/>;
  const props = {
    disabled,
    required,
    value: value ?? "",
    onChange: (e) =>
      onChange(
        multiple
          ? [...e.target.selectedOptions].map((o) => o.value).join(",")
          : e.target.value,
      ),
  };
  const type = money.includes(name)
    ? "number"
    : {
        email: "email",
        password: "password",
        oldPassword: "password",
        from: "date",
        to: "date",
        color: "color",
      }[name] || "text";
  return (
    <label>
      {label(name)}
      {options ? (
        <select
          {...props}
          multiple={multiple}
          value={
            multiple
              ? String(value || "")
                  .split(",")
                  .filter(Boolean)
              : (value ?? "")
          }
        >
          {!multiple && <option value="">{filter ? "All" : "Select…"}</option>}
          {options.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...props}
          type={type}
          step={type === "number" ? ".01" : undefined}
          min={type === "number" ? 0 : undefined}
          minLength={name === "password" ? 12 : undefined}
        />
      )}
    </label>
  );
}
