# DealHunt — Black Friday 2026 deal finder

A static deal-finder site for Black Friday and Cyber Monday 2026: 40 real deals
from Amazon, Best Buy, Walmart, Target, Disney+ and Apple TV, each with the
product, the store, a link to the product at that store, the sale price, the
usual price, the computed discount, when the price was checked and where it was
read — plus an honest verdict on whether it is really a deal (NEW LOW, STRONG
DEAL or ROUTINE SALE). Search, category, store and minimum-discount filters and
four sort orders all work; every deal has its own page, and the most-shopped
products show the same product's price at other stores.

## How the deals were checked

Every price was read from the store's own listing or from a deals roundup that
names the store, on 27 Nov 2026 (05:30 UTC). The "was" price is the store's
list price and the discount is computed from the two prices. Prices can change;
the site says so and asks shoppers to confirm the price on the store page
before buying.

## Run it

```
node serve.ts
```

Then open http://localhost:8080. No build step, no network requests — the deals
are data in `app/data.js`.

## Hand it in

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored `vendor/makefun-frontend.ts` library.

## Layout

- `app/index.html` — page shell, search and filter controls
- `app/data.js` — the 40 checked deals
- `app/views.js` — deal cards, the board and the deal page
- `app/main.js` — hash router, filters and sorting
- `app/style.css` — the site's look
- `shots.json` — the three screenshot views (board, one deal, one deal on a phone)
