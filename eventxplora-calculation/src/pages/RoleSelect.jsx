import React from "react";
import { Link } from "react-router-dom";
import { Users, Building2, TrendingUp, ArrowRight, Info } from "lucide-react";

const roles = [
  {
    to: "/buyer",
    icon: Users,
    title: "Buyer",
    desc: "Select your tickets and see the exact GST + fee breakup at checkout — right down to the final payable amount.",
    accent: "from-brand-600 to-brand-700",
  },
  {
    to: "/organizer",
    icon: Building2,
    title: "Organizer",
    desc: "Set your event's ticket price, coupon, and tickets sold, then view your net settlement statement.",
    accent: "from-brand-700 to-brand-900",
  },
  {
    to: "/platform",
    icon: TrendingUp,
    title: "Platform Owner",
    desc: "Configure platform fee, PG fee, convenience fee, TDS, and 'who pays' rules — for the whole platform.",
    accent: "from-[#F2A93B] to-[#D98A1E]",
  },
];

export default function RoleSelect() {
  return (
    <div>
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          One engine, three statements
        </p>
        <h1 className="font-display mt-1 text-2xl font-bold text-ink sm:text-3xl">
          Which role do you want to view as?
        </h1>
        <p className="mt-2 text-sm text-body">
          Whatever fee/GST/TDS rules the Platform Owner saves are instantly reflected in the
          Buyer and Organizer calculations — everyone pulls from the same shared engine.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((r) => (
          <Link
            key={r.to}
            to={r.to}
            className="group relative overflow-hidden rounded-2xl border border-brand-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${r.accent} text-white`}
            >
              <r.icon size={20} />
            </div>
            <h2 className="font-display text-lg font-bold text-ink">{r.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-body">{r.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
              Open {r.title} view
              <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex items-start gap-2 rounded-xl border border-brand-100 bg-white px-4 py-3.5 text-xs text-body">
        <Info size={15} className="mt-0.5 shrink-0 text-brand-600" />
        <p>
          GST and TDS are provided here as configurable defaults (many services sit at 18% under
          the CBIC service-rate schedule; Section 194-O lists a 0.1% TDS rate) — validate exact
          applicability with your CA / tax advisor before using this in production.
        </p>
      </div>
    </div>
  );
}
