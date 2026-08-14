// Shows the exact calculated value — no rounding to 2 decimals.
// minimumFractionDigits keeps at least paise-level precision (e.g. ₹45.00),
// maximumFractionDigits is high enough that nothing gets silently rounded off.
export const inr = (n) =>
  (isFinite(n) ? n : 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 10,
  });
