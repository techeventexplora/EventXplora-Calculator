import React, { useMemo } from "react";
import { Percent, CreditCard, Landmark, Info } from "lucide-react";
import { useConfig } from "../context/ConfigContext.jsx";
import { computeEngine } from "../lib/engine.js";
import { Field, Section, BearerPills, inputCls, selectCls, StatRow, Rail, TotalBar } from "../components/ui.jsx";

export default function PlatformOwnerView() {
  const { adminConfig, setAdminConfig, eventConfig } = useConfig();

  const set = (key) => (e) => {
    const v = e && e.target ? e.target.value : e;
    setAdminConfig((c) => ({
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
          Platform Fee Configuration
        </h2>

        <Section icon={Percent} title="Platform Fee" defaultOpen>
          <Field label="Type">
            <select className={selectCls} value={adminConfig.platformFeeType} onChange={set("platformFeeType")}>
              <option value="percent">Percentage</option>
              <option value="fixed">Fixed (₹)</option>
              <option value="percent_fixed">Percentage + Fixed</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            {adminConfig.platformFeeType !== "fixed" && (
              <Field label="Fee %">
                <input type="number" className={inputCls} value={adminConfig.platformFeePct} onChange={set("platformFeePct")} />
              </Field>
            )}
            {adminConfig.platformFeeType !== "percent" && (
              <Field label="Fixed ₹">
                <input type="number" className={inputCls} value={adminConfig.platformFeeFixed} onChange={set("platformFeeFixed")} />
              </Field>
            )}
            <Field label="GST on fee %">
              <input type="number" className={inputCls} value={adminConfig.platformFeeGstPct} onChange={set("platformFeeGstPct")} />
            </Field>
          </div>
          <Field label="Who pays">
            <BearerPills
              value={adminConfig.platformFeeBearer}
              onChange={(v) => setAdminConfig((c) => ({ ...c, platformFeeBearer: v }))}
              options={[
                { value: "buyer", label: "Buyer" },
                { value: "organizer", label: "Organizer" },
                { value: "split", label: "Split" },
              ]}
            />
          </Field>
          <Field label="Fees calculated on">
            <BearerPills
              value={adminConfig.feeCalcBase}
              onChange={(v) => setAdminConfig((c) => ({ ...c, feeCalcBase: v }))}
              options={[
                { value: "after", label: "After coupon" },
                { value: "before", label: "Before coupon" },
              ]}
            />
          </Field>
        </Section>

        <Section icon={CreditCard} title="Payment Gateway">
          <div className="grid grid-cols-2 gap-3">
            <Field label="PG fee %">
              <input type="number" className={inputCls} value={adminConfig.pgFeePct} onChange={set("pgFeePct")} />
            </Field>
            <Field label="Fixed ₹">
              <input type="number" className={inputCls} value={adminConfig.pgFeeFixed} onChange={set("pgFeeFixed")} />
            </Field>
          </div>
          <Field label="GST on PG fee %">
            <input type="number" className={inputCls} value={adminConfig.pgGstPct} onChange={set("pgGstPct")} />
          </Field>
          <Field label="Who pays">
            <BearerPills
              value={adminConfig.pgFeeBearer}
              onChange={(v) => setAdminConfig((c) => ({ ...c, pgFeeBearer: v }))}
              options={[
                { value: "buyer", label: "Buyer" },
                { value: "organizer", label: "Organizer" },
                { value: "platform", label: "Platform" },
                { value: "split", label: "Split" },
              ]}
            />
          </Field>
        </Section>

        <Section icon={Landmark} title="Convenience Fee &amp; TDS">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Convenience fee (₹)">
              <input type="number" className={inputCls} value={adminConfig.convenienceFee} onChange={set("convenienceFee")} />
            </Field>
            <Field label="GST %">
              <input type="number" className={inputCls} value={adminConfig.convenienceGstPct} onChange={set("convenienceGstPct")} />
            </Field>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-paper px-3 py-2">
            <span className="text-xs font-medium text-[#3A4270]">Waive convenience fee</span>
            <input
              type="checkbox"
              checked={adminConfig.convenienceWaived}
              onChange={(e) => setAdminConfig((c) => ({ ...c, convenienceWaived: e.target.checked }))}
              className="h-4 w-4 accent-brand-600"
            />
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-paper px-3 py-2">
            <span className="text-xs font-medium text-[#3A4270]">TDS applicable (194-O)</span>
            <input
              type="checkbox"
              checked={adminConfig.tdsApplicable}
              onChange={(e) => setAdminConfig((c) => ({ ...c, tdsApplicable: e.target.checked }))}
              className="h-4 w-4 accent-brand-600"
            />
          </div>
          {adminConfig.tdsApplicable && (
            <Field label="TDS %">
              <input type="number" step="0.01" className={inputCls} value={adminConfig.tdsPct} onChange={set("tdsPct")} />
            </Field>
          )}
        </Section>

        <div className="flex items-start gap-2 rounded-xl border border-brand-100 bg-white px-4 py-3 text-[11px] text-muted">
          <Info size={13} className="mt-0.5 shrink-0" />
          These settings instantly reflect in the Buyer and Organizer views (shared config).
        </div>
      </aside>

      <section className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Platform view · {eventConfig.ticketsSold} tickets
        </p>
        <h3 className="font-display mb-5 text-xl font-bold text-ink">What EventXplora earns</h3>

        <Rail
          steps={[
            { label: "Gross revenue", value: r.platformGrossRevenue },
            { label: "Contribution", value: r.platformContribution },
            { label: "Net (post-GST)", value: r.platformNet },
          ]}
        />

        <div className="divide-y divide-brand-100/60">
          <StatRow label="Platform fee revenue" value={r.platformFeeRevenue} />
          <StatRow label="Convenience fee revenue" value={r.convenienceRevenue} />
          <StatRow label="Platform gross revenue" value={r.platformGrossRevenue} strong />
          {r.pgCostBorneByPlatform > 0 && (
            <StatRow label="Payment gateway cost (platform-borne)" value={r.pgCostBorneByPlatform} negative />
          )}
          {r.couponPlatCost * eventConfig.ticketsSold > 0 && (
            <StatRow
              label="Coupon cost (platform-funded share)"
              value={r.couponPlatCost * eventConfig.ticketsSold}
              negative
            />
          )}
          <StatRow label="Platform contribution" value={r.platformContribution} strong />
          <StatRow label="GST payable on fees (indicative)" value={r.platformGstPayable} negative muted />
        </div>

        <TotalBar label="Net profit / loss" value={r.platformNet} />

        <p className="mt-3 flex items-start gap-1.5 text-[11px] text-muted">
          <Info size={13} className="mt-0.5 shrink-0" />
          TDS is not treated here as a direct platform expense — its accounting treatment depends
          on the statutory provision involved; confirm with your CA.
        </p>
      </section>
    </div>
  );
}
