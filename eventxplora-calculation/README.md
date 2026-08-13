# EventXplora Calculation

A shared, configurable pricing & settlement engine for Buyer, Organizer, and Platform
Owner. One calculation core (`src/lib/engine.js`) powers all three role-based views, so the
numbers always stay consistent.

## Roles

- **Buyer** (`/buyer`) — chooses ticket quantity, applies/removes the coupon, and sees the
  exact checkout breakup (ticket price → GST → coupon → platform fee → PG fee → convenience
  fee → final payable).
- **Organizer** (`/organizer`) — sets their event's ticket price, ticket GST, coupon rules,
  and tickets sold; sees their own net settlement statement.
- **Platform Owner** (`/platform`) — configures the platform-wide fee engine: platform fee
  (percentage / fixed / percentage+fixed), payment gateway fee, convenience fee, TDS, GST
  rates per component, and the "who pays" rule (buyer / organizer / platform / split) for
  each fee. Platform revenue and net contribution are also shown here.

Whatever the Platform Owner saves is instantly reflected in the Buyer and Organizer views —
everyone reads from the same shared `ConfigContext` (localStorage-persisted).

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Select a role at `/` to go to the Buyer,
Organizer, or Platform Owner view.

For a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  lib/
    engine.js         # pure calculation engine (single source of truth)
    format.js         # ₹ currency formatter
  context/
    ConfigContext.jsx # shared admin (platform) + event (organizer) config, localStorage-backed
  components/
    Header.jsx         # brand header + role navigation
    ui.jsx              # shared inputs, sections, stat rows, settlement rail
  pages/
    RoleSelect.jsx       # landing / role picker
    BuyerView.jsx         # buyer checkout breakup
    OrganizerView.jsx     # organizer event setup + settlement
    PlatformOwnerView.jsx # platform fee config + revenue statement
```

## Important note

GST and TDS defaults are provided here for reference only (many services sit at 18% under
the CBIC service-rate schedule; the current Income Tax Dept table lists a 0.1% TDS rate for
Section 194-O). Validate exact applicability, thresholds, and exceptions with your CA / tax
advisor before using this in production.
