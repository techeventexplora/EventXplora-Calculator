import React, { useMemo, useState } from "react";
import { Minus, Plus, Ticket, Tag } from "lucide-react";
import { useConfig } from "../context/ConfigContext.jsx";
import { computeEngine } from "../lib/engine.js";
import { Field, inputCls, StatRow, Rail, TotalBar } from "../components/ui.jsx";
import { inr } from "../lib/format.js";

export default function BuyerView() {
  const { adminConfig, eventConfig, buyerQty, setBuyerQty } = useConfig();
  const [couponApplied, setCouponApplied] = useState(true);

  const cfg = useMemo(
    () => ({
      ...adminConfig,
      ...eventConfig,
      couponValue: couponApplied ? eventConfig.couponValue : 0,
      qty: buyerQty,
    }),
    [adminConfig, eventConfig, couponApplied, buyerQty]
  );

  const r = computeEngine(cfg);
  const buyerTotal = r.buyerPayable * buyerQty;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Ticket size={16} className="text-brand-600" />
            <h2 className="font-display text-sm font-bold text-ink">Your tickets</h2>
          </div>
          <p className="text-xs text-body">
            Event ticket price: <span className="font-mono font-semibold text-ink">{inr(eventConfig.ticketPrice)}</span>
          </p>

          <Field label="Quantity" hint="How many tickets to buy">
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBuyerQty((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-100 text-brand-600 hover:bg-brand-100"
              >
                <Minus size={14} />
              </button>
              <input
                type="number"
                min={1}
                className={inputCls + " text-center"}
                value={buyerQty}
                onChange={(e) => setBuyerQty(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <button
                type="button"
                onClick={() => setBuyerQty((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-100 text-brand-600 hover:bg-brand-100"
              >
                <Plus size={14} />
              </button>
            </div>
          </Field>

          <label className="mt-4 flex items-center justify-between rounded-lg bg-paper px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-xs font-medium text-[#3A4270]">
              <Tag size={13} className="text-brand-600" />
              Apply coupon (
              {eventConfig.couponType === "percent"
                ? `${eventConfig.couponValue}%`
                : inr(eventConfig.couponValue)}
              )
            </span>
            <input
              type="checkbox"
              checked={couponApplied}
              onChange={(e) => setCouponApplied(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-white p-5 text-xs text-body shadow-sm">
          Fee rates and GST% come from the Platform Owner's config; ticket price &amp; coupon come
          from the Organizer's event — the Buyer just picks a quantity and applies the coupon.
        </div>
      </aside>

      <section className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Checkout breakup · {buyerQty} × {inr(eventConfig.ticketPrice)}
        </p>
        <h3 className="font-display mb-5 text-xl font-bold text-ink">What you pay</h3>

        <Rail
          steps={[
            { label: "Ticket price", value: cfg.ticketPrice * buyerQty },
            { label: "− Coupon", value: r.discountedTicket * buyerQty },
            { label: "Total payable", value: buyerTotal },
          ]}
        />

        <div className="divide-y divide-brand-100/60">
          <StatRow label="Ticket price" value={cfg.ticketPrice * buyerQty} />
          {eventConfig.ticketGstApplicable && (
            <StatRow label="Ticket GST" value={r.ticketGst * buyerQty} />
          )}
          {couponApplied && (
            <StatRow label="Coupon discount" value={r.couponDiscount * buyerQty} negative />
          )}
          <StatRow label="Discounted ticket amount" value={r.discountedTicket * buyerQty} strong />
          {r.buyerRplatform > 0 && (
            <>
              <StatRow
                label="Platform fee"
                value={r.platformFee * r.buyerRplatform * buyerQty}
              />
              <StatRow
                label="GST on platform fee"
                value={r.platformFeeGst * r.buyerRplatform * buyerQty}
                muted
              />
            </>
          )}
          {r.buyerRpg > 0 && (
            <>
              <StatRow label="Payment gateway fee" value={r.pgFee * r.buyerRpg * buyerQty} />
              <StatRow label="GST on PG fee" value={r.pgGst * r.buyerRpg * buyerQty} muted />
            </>
          )}
          {!adminConfig.convenienceWaived && (
            <>
              <StatRow label="Convenience fee" value={r.convFee * buyerQty} />
              <StatRow label="GST on convenience fee" value={r.convGst * buyerQty} muted />
            </>
          )}
        </div>

        <TotalBar label={`Total payable (${buyerQty} ticket${buyerQty > 1 ? "s" : ""})`} value={buyerTotal} />
      </section>
    </div>
  );
}
