/* ---------------------------------------------------------------
   EventXplora Calculation — core pricing/settlement engine.

   This is the single source of truth for the math described in the
   platform spec: Ticket -> Ticket GST -> Coupon -> Platform Fee
   (+GST) -> Payment Gateway Fee (+GST) -> Convenience Fee (+GST)
   -> TDS -> Buyer Payable / Organizer Payout / Platform Revenue.

   adminConfig  -> owned by the Platform Owner (fee %, GST %, TDS %,
                   who-pays rules). Applies platform-wide.
   eventConfig  -> owned by the Organizer (ticket price, ticket GST,
                   coupon rules, tickets sold for this event).
   qty          -> ticket quantity for the statement being computed
                   (buyer's cart qty, or organizer/platform's total
                   tickets sold).
------------------------------------------------------------------ */

export const defaultAdminConfig = {
  feeCalcBase: "after", // "after" | "before" coupon

  platformFeeType: "percent", // "percent" | "fixed" | "percent_fixed"
  platformFeePct: 5,
  platformFeeFixed: 0,
  platformFeeGstPct: 18,
  platformFeeBearer: "buyer", // "buyer" | "organizer" | "split"

  pgFeePct: 2,
  pgFeeFixed: 0,
  pgGstPct: 18,
  pgFeeBearer: "buyer", // "buyer" | "organizer" | "platform" | "split"

  convenienceFee: 20,
  convenienceGstPct: 18,
  convenienceWaived: false,

  tdsApplicable: true,
  tdsPct: 0.1,
};

export const defaultEventConfig = {
  ticketPrice: 1000,
  ticketGstApplicable: false,
  ticketGstPct: 18,

  couponType: "percent", // "percent" | "flat"
  couponValue: 10,
  couponCap: 0, // 0 = no cap
  couponFunding: "organizer", // "organizer" | "platform" | "split"

  ticketsSold: 10,
};

const ratio = (bearer, target) => {
  if (bearer === target) return 1;
  if (bearer === "split" && (target === "buyer" || target === "organizer")) return 0.5;
  return 0;
};

export function computeEngine(cfg) {
  const qty = cfg.qty ?? 1;

  const ticketGst = cfg.ticketGstApplicable ? (cfg.ticketPrice * cfg.ticketGstPct) / 100 : 0;
  const ticketWithGst = cfg.ticketPrice + ticketGst;

  let couponDiscount =
    cfg.couponType === "percent" ? (ticketWithGst * cfg.couponValue) / 100 : cfg.couponValue;
  if (cfg.couponCap > 0) couponDiscount = Math.min(couponDiscount, cfg.couponCap);
  couponDiscount = Math.max(0, Math.min(couponDiscount, ticketWithGst));

  const discountedTicket = ticketWithGst - couponDiscount;
  const feeBase = cfg.feeCalcBase === "after" ? discountedTicket : ticketWithGst;

  const platformFee =
    (cfg.platformFeeType !== "fixed" ? (feeBase * cfg.platformFeePct) / 100 : 0) +
    (cfg.platformFeeType !== "percent" ? cfg.platformFeeFixed : 0);
  const platformFeeGst = (platformFee * cfg.platformFeeGstPct) / 100;

  const pgFee = (feeBase * cfg.pgFeePct) / 100 + cfg.pgFeeFixed;
  const pgGst = (pgFee * cfg.pgGstPct) / 100;

  const convFee = cfg.convenienceWaived ? 0 : cfg.convenienceFee;
  const convGst = (convFee * cfg.convenienceGstPct) / 100;

  const tds = cfg.tdsApplicable ? (feeBase * cfg.tdsPct) / 100 : 0;

  const buyerRplatform = ratio(cfg.platformFeeBearer, "buyer");
  const orgRplatform = ratio(cfg.platformFeeBearer, "organizer");
  const buyerRpg = ratio(cfg.pgFeeBearer, "buyer");
  const orgRpg = ratio(cfg.pgFeeBearer, "organizer");
  const platRpg = ratio(cfg.pgFeeBearer, "platform");

  const buyerPayable =
    discountedTicket +
    (platformFee + platformFeeGst) * buyerRplatform +
    (pgFee + pgGst) * buyerRpg +
    (convFee + convGst);

  const couponOrgCost =
    cfg.couponFunding === "organizer"
      ? couponDiscount
      : cfg.couponFunding === "split"
      ? couponDiscount / 2
      : 0;
  const couponPlatCost = couponDiscount - couponOrgCost;

  const organizerGross = cfg.ticketPrice * qty;
  const organizerNetSales = organizerGross - couponOrgCost * qty;
  // Organizer is billed fee + its GST for whichever fees it bears (mirrors buyerPayable logic).
  const organizerPlatformFeeAmount = platformFee * orgRplatform * qty;
  const organizerPlatformFeeGstAmount = platformFeeGst * orgRplatform * qty;
  const organizerPlatformDeduction = organizerPlatformFeeAmount + organizerPlatformFeeGstAmount;
  const organizerPgFeeAmount = pgFee * orgRpg * qty;
  const organizerPgFeeGstAmount = pgGst * orgRpg * qty;
  const organizerPgDeduction = organizerPgFeeAmount + organizerPgFeeGstAmount;
  const organizerTds = tds * qty;
  const organizerNetPayout =
    organizerNetSales - organizerPlatformDeduction - organizerPgDeduction - organizerTds;

  const platformFeeRevenue = platformFee * qty;
  const convenienceRevenue = convFee * qty;
  const platformGrossRevenue = platformFeeRevenue + convenienceRevenue;
  // Platform is billed fee + GST for PG cost when platform itself bears the PG fee.
  const pgCostBorneByPlatform = (pgFee + pgGst) * platRpg * qty;
  const platformGstPayable = (platformFeeGst + convGst) * qty;
  const platformContribution =
    platformGrossRevenue - pgCostBorneByPlatform - couponPlatCost * qty;
  const platformNet = platformContribution - platformGstPayable;

  return {
    qty,
    ticketGst,
    ticketWithGst,
    couponDiscount,
    discountedTicket,
    feeBase,
    platformFee,
    platformFeeGst,
    pgFee,
    pgGst,
    convFee,
    convGst,
    tds,
    buyerRplatform,
    buyerRpg,
    buyerPayable,
    couponOrgCost,
    couponPlatCost,
    organizerGross,
    organizerNetSales,
    organizerPlatformFeeAmount,
    organizerPlatformFeeGstAmount,
    organizerPlatformDeduction,
    organizerPgFeeAmount,
    organizerPgFeeGstAmount,
    organizerPgDeduction,
    organizerTds,
    organizerNetPayout,
    platformFeeRevenue,
    convenienceRevenue,
    platformGrossRevenue,
    pgCostBorneByPlatform,
    platformGstPayable,
    platformContribution,
    platformNet,
  };
}
