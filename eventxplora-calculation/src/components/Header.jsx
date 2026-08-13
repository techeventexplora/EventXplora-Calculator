import React from "react";
import { NavLink } from "react-router-dom";
import { Users, Building2, TrendingUp, LayoutGrid } from "lucide-react";

const navItems = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/buyer", label: "Buyer", icon: Users },
  { to: "/organizer", label: "Organizer", icon: Building2 },
  { to: "/platform", label: "Platform Owner", icon: TrendingUp },
];

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-white/5" />
      <div className="relative mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="90 40"
                transform="rotate(-40 24 24)"
              />
              <rect x="14" y="15" width="16" height="5" rx="2.5" fill="white" />
              <rect x="14" y="22" width="11" height="5" rx="2.5" fill="white" />
              <rect x="14" y="29" width="16" height="5" rx="2.5" fill="white" />
              <circle cx="34" cy="24" r="4" fill="white" />
            </svg>
            <div>
              <p className="font-display text-lg font-bold leading-tight text-white sm:text-xl">
                EventXplora Calculation
              </p>
              <p className="text-xs font-medium text-white/70">
                Buyer · Organizer · Platform Owner — one shared pricing engine
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-1.5 rounded-xl bg-white/10 p-1.5 backdrop-blur-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    isActive ? "bg-white text-ink shadow-sm" : "text-white/85 hover:bg-white/10"
                  }`
                }
              >
                <item.icon size={14} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
