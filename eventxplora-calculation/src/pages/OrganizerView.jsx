import React, { useMemo } from "react";
import { Ticket, Sparkles, Building2 } from "lucide-react";
import { useConfig } from "../context/ConfigContext.jsx";
import { computeEngine } from "../lib/engine.js";
import { Field, Section, BearerPills, inputCls, selectCls, StatRow, Rail, TotalBar } from "../components/ui.jsx";

export default function OrganizerView() {
  const { adminConfig, eventConfig, setEventConfig } = useConfig();

  const set = (key) => (e) => {
    const v = e && e.target ? e.target.value : e;
    setEventConfig((c) => ({
      ...c,
      [key]: typeof c[key] === "number" ? parseFloat(v) || 0 : v,
    }));
  };

  const cfg = useMemo(() => ({ ...adminConfig, ...eventConfig, qty: eventConfig.ticketsSold }), [
    adminConfig,
    eventConfig,
  ]);
  const r = computeEngine(cfg);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      <aside className="space-y-3 lg:sticky lg:top-6 lg:h-fit">
        <h2 className="font-display px-1 text-sm font-bold uppercase tracking-wide text-ink">
          Event Setup
        </h2>

        <Section icon={Ticket} title="Ticket &amp; Sales" defaultOpen>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ticket price (₹)">
              <input type="number" className={inputCls} value={eventConfig.ticketPrice} onChange={set("ticketPrice")} />
            </Field>
            <Field label="Tickets sold">
              <input type="number" className={inputCls} value={eventConfig.ticketsSold} onChange={set("ticketsSold")} />
            </Field>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-paper px-3 py-2">
            <span className="text-xs font-medium text-[#3A4270]">Ticket GST applicable</span>
            <input
              type="checkbox"
              checked={eventConfig.ticketGstApplicable}
              onChange={(e) => setEventConfig((c) => ({ ...c, ticketGstApplicable: e.target.checked }))}
              className="h-4 w-4 accent-brand-600"
            />
          </div>
          {eventConfig.ticketGstApplicable && (
            <Field label="Ticket GST %">
              <input type="number" className={inputCls} value={eventConfig.ticketGstPct} onChange={set("ticketGstPct")} />
            </Field>
          )}
        </Section>

        <Section icon={Sparkles} title="Coupon / Promo">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select className={selectCls} value={eventConfig.couponType} onChange={set("couponType")}>
                <option value="percent">Percentage</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </Field>
            <Field label={eventConfig.couponType === "percent" ? "Value (%)" : "Value (₹)"}>
              <input type="number" className={inputCls} value={eventConfig.couponValue} onChange={set("couponValue")} />
            </Field>
          </div>
          <Field label="Max discount cap (₹, 0 = none)">
            <input type="number" className={inputCls} value={eventConfig.couponCap} onChange={set("couponCap")} />
          </Field>
          <Field label="Funded by">
            <BearerPills
              value={eventConfig.couponFunding}
              onChange={(v) => setEventConfig((c) => ({ ...c, couponFunding: v }))}
              options={[
                { value: "organizer", label: "Organizer" },
                { value: "platform", label: "Platform" },
                { value: "split", label: "Split 50/50" },
              ]}
            />
          </Field>
        </Section>

        <div className="rounded-xl border border-brand-100 bg-white p-4 text-xs text-body">
          <p className="mb-2 flex items-center gap-1.5 font-semibold text-ink">
            <Building2 size={13} className="text-brand-600" />
            Current platform rules (read-only)
          </p>
          <ul className="space-y-1">
            <li>Platform fee: {adminConfig.platformFeePct}% · borne by {adminConfig.platformFeeBearer}</li>
            <li>PG fee: {adminConfig.pgFeePct}% · borne by {adminConfig.pgFeeBearer}</li>
            <li>Convenience fee: ₹{adminConfig.convenienceFee}</li>
            <li>TDS: {adminConfig.tdsApplicable ? `${adminConfig.tdsPct}%` : "Not applicable"}</li>
          </ul>
        </div>
      </aside>

      <section className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Settlement breakup · {eventConfig.ticketsSold} tickets
        </p>
        <h3 className="font-display mb-5 text-xl font-bold text-ink">What you'll receive</h3>

        <Rail
          steps={[
            { label: "Gross sales", value: r.organizerGross },
            { label: "Net sales", value: r.organizerNetSales },
            { label: "Net payout", value: r.organizerNetPayout },
          ]}
        />

        <div className="divide-y divide-brand-100/60">
          <StatRow
            label={`Gross ticket sales (${eventConfig.ticketsSold} tickets)`}
            value={r.organizerGross}
            strong
          />
          {r.couponOrgCost * eventConfig.ticketsSold > 0 && (
            <StatRow
              label="Coupon cost (organizer-funded share)"
              value={r.couponOrgCost * eventConfig.ticketsSold}
              negative
            />
          )}
          <StatRow label="Net ticket sales" value={r.organizerNetSales} strong />
          {r.organizerPlatformDeduction > 0 && (
            <StatRow label="Platform fee / commission" value={r.organizerPlatformDeduction} negative />
          )}
          {r.organizerPgDeduction > 0 && (
            <StatRow label="Payment gateway fee" value={r.organizerPgDeduction} negative />
          )}
          {adminConfig.tdsApplicable && (
            <StatRow label={`TDS (Sec 194-O, ${adminConfig.tdsPct}%)`} value={r.organizerTds} negative />
          )}
        </div>

        <TotalBar label="Net settlement" value={r.organizerNetPayout} />
      </section>
    </div>
  );
}
