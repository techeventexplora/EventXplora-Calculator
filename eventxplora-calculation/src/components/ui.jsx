import React from "react";
import { ChevronDown } from "lucide-react";
import { inr } from "../lib/format.js";

export const inputCls =
  "w-full rounded-lg border border-brand-100 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20";
export const selectCls = inputCls + " appearance-none";

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-body">
        {label}
      </span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

export function Section({ icon: Icon, title, defaultOpen, children }) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-brand-100 bg-white/60 open:bg-white open:shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          {Icon && <Icon size={16} className="text-brand-600" />}
          {title}
        </span>
        <ChevronDown size={16} className="text-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-3 px-4 pb-4">{children}</div>
    </details>
  );
}

export function BearerPills({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
            value === opt.value
              ? "border-brand-600 bg-brand-600 text-white shadow-sm"
              : "border-brand-100 bg-white text-body hover:border-brand-600/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function StatRow({ label, value, muted, strong, negative }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={`text-sm ${muted ? "text-muted" : "text-[#3A4270]"}`}>{label}</span>
      <span
        className={`font-mono text-sm tabular-nums ${
          strong ? "text-base font-bold text-ink" : "text-ink"
        } ${negative ? "text-rose" : ""}`}
      >
        {negative && value > 0 ? "\u2212 " : ""}
        {inr(value)}
      </span>
    </div>
  );
}

export function Rail({ steps }) {
  return (
    <div className="relative mb-6 overflow-x-auto pb-2">
      <div className="flex min-w-max items-center gap-0">
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <div className="flex flex-col items-center px-3 text-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                  i === steps.length - 1
                    ? "border-gold bg-gold text-white"
                    : "border-brand-600/30 bg-brand-100 text-brand-600"
                }`}
              >
                {i + 1}
              </div>
              <span className="mt-1.5 w-20 text-[10px] font-semibold uppercase tracking-wide text-body">
                {s.label}
              </span>
              <span className="font-mono text-[11px] font-semibold text-ink">{inr(s.value)}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-[2px] w-8 shrink-0 bg-gradient-to-r from-brand-600/40 to-brand-600/10 sm:w-14" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function TotalBar({ label, value }) {
  return (
    <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-900 px-4 py-3.5">
      <span className="text-sm font-semibold text-white/80">{label}</span>
      <span className="font-mono text-lg font-bold text-white">{inr(value)}</span>
    </div>
  );
}
