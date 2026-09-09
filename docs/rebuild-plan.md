# Charah website rebuild — build plan

Last updated: 2026-09-03

## Decisions locked

| Area | Decision |
|---|---|
| Framework | Keep **Next.js 15 (App Router) + React 19 + Tailwind + shadcn/ui**, deploy on Vercel |
| Content | No CMS. All content as **typed TS data files** in `content/` + simple JSX rendering. Updated via Claude Code. (MDX can be added later if recipes need long-form prose.) |
| Commerce | **Stripe Checkout, built into the site** (custom cart → Stripe hosted payment). Square Online was tried and dropped 2026-09-07 — see [Commerce section](#commerce-stripe-checkout-built-into-the-site-2026-09-07) below. Shopify Basic stays the documented fallback. |
| Design | **Evolve** the current identity, don't rebrand. Systematize: one red, real display + text type pairing, type/spacing scales, real nav + footer. |
| Theme | **Light-only.** Drop dark mode from public pages. |
| Palette | red `#F43711`, red-dark `#C42D0E`, ink `#0E0B0A`, cream `#FBF6EF`, stone `#6B6259`, border `#E7DED2`. **No gold accent.** |
| Type | Headings **Playfair Display**, body **Inter**, impact/logo **Anton**. |
| Routes | **10 pages** — Wholesale and FAQ dropped for launch. |

## Phase map

1. **Phase 1 — design system + shell** (this doc, detailed below)
2. **Phase 2 — content pages** — Products, Our Story, Recipes (8 seeded), Where to Buy (list), FAQ, Wholesale, Contact, Legal
3. **Phase 3 — commerce** — Stripe Checkout, cart, order emails, Klaviyo newsletter

---

# Phase 1 — design system + shell

Goal: a branded, documented design system in code; header + footer on every page; all routes scaffolded with on-brand placeholders; the home page rebuilt on the system; content directory + types ready for Phase 2.

## 0. Repo hygiene

- [ ] Standardize on **pnpm** — delete `package-lock.json`, keep `pnpm-lock.yaml`.
- [ ] Rename `package.json` `"name"` from `my-v0-project` to `charah-website`.
- [ ] Delete the unused `styles/globals.css` (duplicate). Keep `app/globals.css` as the single stylesheet.
- [ ] Add `/docs` is tracked; confirm `.gitignore` is fine (it is — `.next`, `.vercel`, `.env*`, `node_modules` all covered).
- [ ] Remove `generator: 'v0.app'` from metadata.
- [ ] Prune obviously-unused shadcn primitives later (not now — leave `components/ui/*` intact).

## 1. Design tokens

Define in `app/globals.css` (`:root`) and expose through `tailwind.config.ts`. Remove the `.dark` block.

**Palette (proposed — confirm hex values):**

| Token | Hex | Use |
|---|---|---|
| `charah-red` | `#F43711` | Primary — CTAs, links, accents |
| `charah-red-dark` | `#C42D0E` | Hover, red text on light bg (AA) |
| `charah-ink` | `#0E0B0A` | Near-black — headings, dark sections |
| `charah-cream` | `#FBF6EF` | Default page background |
| `charah-stone` | `#6B6259` | Secondary/muted text |
| `charah-border` | `#E7DED2` | Hairlines on cream |
| `charah-gold` | `#E3A43B` | Optional small accent (chili-oil warmth) |

- Map shadcn's `primary` → `charah-red` / `primary-foreground` → `charah-cream`.
- Set `--radius: 0.5rem`; use `rounded-2xl` for image cards.

**Type scale** — add to `tailwind.config.ts` `fontSize` (fluid `clamp()` for display sizes):

- `display-xl` (hero), `display-lg`, `display-md` → Anton
- `h1`–`h4` → Playfair Display
- `body-lg`, `body`, `body-sm` → Inter

**Spacing rhythm** — standard section padding: `py-16 md:py-24`. Bake into `<Section>` component.

**Container** — keep Tailwind `container` but tighten content max-width to ~1200px (`2xl: 1200px`), keep `padding: 2rem`.

## 2. Fonts

- Keep **Inter** (body) and **Anton** (`--font-anton`, display) — already wired via `next/font/google`.
- Add **Playfair Display** (`next/font/google`, `--font-playfair`, weights 500/600/700) for headings.
- Wire all three CSS variables on `<body>` in `app/layout.tsx`.
- Tailwind `fontFamily`: `sans` → Inter, `serif` → Playfair Display (replace the Georgia placeholder), `display` → Anton.

## 3. Shell components

- [ ] `components/site-header.tsx` — sticky, blur bg, logo + wordmark, desktop nav, mobile nav via shadcn `Sheet`. Nav items from `content/site.ts`.
- [ ] `components/announcement-bar.tsx` — the black stockist banner; text from `content/site.ts`.
- [ ] `components/site-footer.tsx` — extract current footer; real links to all routes; social from `content/site.ts`; newsletter slot (placeholder until Phase 3).
- [ ] `app/layout.tsx` — render `<AnnouncementBar />` + `<SiteHeader />` + `{children}` + `<SiteFooter />` so every route inherits them. Default `metadata` + `metadataBase`.

## 4. Shared UI

- [ ] `components/section.tsx` — vertical rhythm wrapper (`light` | `cream` | `ink` variants).
- [ ] `components/page-header.tsx` — consistent page title + intro block for interior pages.
- [ ] `components/prose.tsx` — long-form wrapper. Add `@tailwindcss/typography`; theme it to brand tokens.
- [ ] Align shadcn `Button` variants to brand (`default` = `charah-red`, add `outline`/`ghost` on cream).
- [ ] `lib/seo.ts` — `buildMetadata()` helper for per-page `Metadata`.
- [ ] `app/sitemap.ts`, `app/robots.ts`.
- [ ] Default OG image (`app/opengraph-image.tsx` or a static PNG in `public/`).

## 5. Route scaffolding

Create each route with a styled `<PageHeader>` + "Coming soon" body using the design system, so nav never 404s:

```
app/products/page.tsx
app/products/[slug]/page.tsx
app/recipes/page.tsx
app/recipes/[slug]/page.tsx
app/where-to-buy/page.tsx
app/shop/page.tsx
app/story/page.tsx
app/contact/page.tsx
app/legal/privacy/page.tsx
app/legal/terms/page.tsx
```

10 routes. Route naming confirmed: `/story`, `/where-to-buy`, `/shop`. Wholesale + FAQ dropped.

## 6. Home page rebuild (`app/page.tsx`)

Split the monolith into `components/home/*`:

- [ ] `hero.tsx` — fix text contrast (stronger scrim + larger type, verified AA), responsive art direction on `headline.png`, `priority` image. Anton headline, Inter subhead.
- [ ] `product-highlight.tsx` — reusable for Original + Chili Oil; links to `/products/[slug]`; drop inline `style={{backgroundColor}}` for tokens.
- [ ] `story-teaser.tsx` — short Flora & Clara blurb on `charah-ink`; links to `/story`.
- [ ] `where-to-buy-teaser.tsx` — stockist logos/names; links to `/where-to-buy`.
- [ ] `recipes-teaser.tsx` — 3 recipe cards; links to `/recipes`.
- [ ] Move all home copy into `content/home.ts`.

## 7. Content layer setup

- [ ] `content/site.ts` — nav items, announcement text, social links, contact email.
- [ ] `content/products.ts` — typed: slug, name, tagline, description, ingredients, allergens, price, image, tasting notes, uses.
- [ ] `content/stockists.ts` — typed: name, address, city, state, zip, lat, lng, hours, phone, url, type (`retail` | `restaurant` | `online`), products carried.
- [ ] `content/home.ts` — home copy blocks.
- [ ] `content/recipes.ts` — `Recipe` TS type + exported array. Add **1 sample recipe** now; the other 7 land in Phase 2.

Recipe type:

```ts
type Recipe = {
  title: string
  slug: string
  description: string
  image: string
  product: ("original" | "chili-oil")[]
  protein: "pork" | "chicken" | "tofu" | "vegetable" | "seafood" | "beef"
  meal: "main" | "side" | "snack" | "breakfast" | "sauce"
  difficulty: "easy" | "medium" | "advanced"
  prepMinutes: number
  cookMinutes: number
  servings: number
  tags: string[]
  intro: string
  ingredients: { group?: string; items: string[] }[]
  steps: string[]
  tips?: string[]
}
```

## 8. Dependencies to add

None. Fonts come through `next/font/google`. (`@tailwindcss/typography` deferred to Phase 2 with the long-form pages.)

## 9. Verification (before calling Phase 1 done)

- [ ] `pnpm build` passes, zero TS errors.
- [ ] Every nav link resolves (no 404).
- [ ] Home hero text passes WCAG AA contrast (check with browser tooling).
- [ ] Desktop + mobile screenshots of home, one interior route, header/mobile-nav open.
- [ ] Lighthouse: performance & a11y ≥ 90 on home.

## Phase 1 status — built on branch `rebuild-phase-1`

Done:

- Repo hygiene: pnpm only (`package-lock.json` removed), duplicate `styles/globals.css` removed, package renamed `charah-website`, v0 `generator` metadata removed.
- Tokens in `app/globals.css` + `tailwind.config.ts`: brand colours as `charah-*` utilities, `font-serif` → Playfair, `font-display` → Anton, fluid type scale (`display-*`, `h1`–`h4`, `body-*`), `py-section` spacing, container maxed at 1200px, dark-mode CSS block removed.
- Fonts wired in `app/layout.tsx`: Inter + Anton + Playfair Display via `next/font/google`.
- Shell: `SiteHeader` (sticky, desktop nav + mobile `Sheet`), `SiteFooter` — in `app/layout.tsx` so every route inherits them.
- Shared UI: `Section` (cream/surface/ink tones), `PageHeader`, `ComingSoon`, `lib/seo.ts` (`buildMetadata`), `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`.
- Content layer: `content/site.ts`, `content/products.ts` (2 products), `content/stockists.ts` (3 + `stockistsByRegion`, geocoded), `content/recipes.ts` (1 sample + helpers), `content/home.ts`.
- Routes (10): `/` rebuilt from `components/home/*`; `/products` + `/products/[slug]`, `/recipes` + `/recipes/[slug]`, `/store-locator` (list + Leaflet/OSM map, no API key) all rendering real data; `/shop` placeholder w/ product cards + notify block; `/about`, `/contact` real-but-light; `/legal/privacy` + `/legal/terms` `ComingSoon`.
- Nav restructured to **About Us · Shop · Store Locator · Recipes** (dropped the standalone "Sauces" link — `/products` stays live, linked from the footer and cross-links) and the black `AnnouncementBar` **removed** — both per the user, referencing [themeathook.com](https://www.themeathook.com)'s clean light header with no announcement strip. Routes renamed to match: `/story` → `/about`, `/where-to-buy` → `/store-locator`.
- Verified: `next build` green (18 routes), `tsc --noEmit` clean, no console errors, home + recipe detail + store locator + about checked in-browser.

Not carried over from the original plan (deferred):

- `@tailwindcss/typography` / `Prose` — Phase 2 with the long-form pages.
- Contact form, recipe filters + `schema.org/Recipe`, full Our Story copy, legal copy — Phase 2.
- Lighthouse pass — run before Phase 2 sign-off.

## Phase 1 deliverables (original)

- Branded token set + type/spacing scales in code, documented here.
- Fraunces added; `font-serif` no longer Georgia.
- Header (with mobile nav) + footer on every route.
- 12 routes scaffolded on-brand.
- Home page rebuilt from sections + `content/home.ts`.
- `content/` directory with typed data files + working MDX recipe pipeline (1 sample).
- SEO plumbing: metadata helper, sitemap, robots, default OG.

---

## Open questions before starting Phase 1

1. **Palette hex values** — approve the table in §1 or adjust.
2. **Fraunces** for headings — good, or want to see 1–2 alternatives first?
3. **`charah-gold` accent** — include it or keep to red/ink/cream only?
4. Anything to **cut from the route list** for launch (e.g. Wholesale, FAQ)?

---

## Phase 2 outline (not yet detailed)

Products pages, Our Story, Recipes index with filters + `schema.org/Recipe` JSON-LD + 8 recipes, FAQ, Wholesale inquiry form, Contact, Privacy/Terms. (Where to Buy's map shipped early — see Phase 1 status.)

## Commerce: Stripe Checkout, built into the site (2026-09-07)

Square Online was tried and abandoned — its setup flow kept dropping the user into the restaurant "Online Ordering" product, and it's all configured on Square's side so it couldn't be unblocked here. Switched to **Stripe Checkout**, which is code we control.

**Decision: custom cart on our site + Stripe hosted Checkout for payment.**

- **$0/mo**, 2.9% + 30¢ per order.
- Multi-item cart in our own design; hand off to Stripe's hosted page for payment only.
- Shipping tiers live in our code, not a third-party dashboard.
- Shippo stays standalone for now (buy labels by hand from the order); its API can be wired into a webhook later.

**Catalog** (prices in `content/products.ts`, source of truth for what the server charges):
BBQ Sauce **$16**, Chili Oil **$12**, "The Duo" **$25**.

**Shipping** (`lib/commerce.ts` — `computeShippingCents`): 1 jar = **$9.99**, 2+ jars = **$3.99**, subtotal ≥ **$75** = free. The Duo counts as **2 jars** for the tier (`shipUnits`).

**Built (branch `rebuild-phase-1`):**

- `lib/commerce.ts` — `getSellable`, `priceCart`, `computeShippingCents`, `SHIPPING` constants, `formatUsd`. Shared by cart UI and the API route.
- `components/cart/` — `cart-provider.tsx` (context + localStorage, `charah.cart.v1`), `cart-sheet.tsx` (drawer: line items, qty steppers, subtotal, live shipping, Checkout), `add-to-cart-button.tsx`, `clear-cart.tsx`.
- `app/api/checkout/route.ts` — POST `{ lines }` → validates against our prices → creates a Stripe Checkout Session with server-built line items + the one computed shipping rate + US address collection → returns `{ url }`. Graceful 500 if `STRIPE_SECRET_KEY` is unset.
- `app/checkout/success` + `app/checkout/cancel` pages. Success clears the cart.
- `CartProvider` in `app/layout.tsx`; cart icon + drawer in the header.
- `/shop` + `/products/[slug]` — "Add to cart" buttons (removed the Square `commerce`/`buyUrl` config from `content/site.ts`).
- `.env.example` documents `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_SITE_URL`.
- Verified in-browser: add to cart, qty steppers, subtotal, and all three shipping tiers compute correctly. Redirect itself needs a real Stripe key.

**Still needed:**

1. **From the user:** create a Stripe account, put `STRIPE_SECRET_KEY` (test key first) in `.env.local` and in Vercel env vars. Set `NEXT_PUBLIC_SITE_URL` in Vercel to the production domain.
2. In Stripe: turn on the merchant email notification for successful payments (Settings → Business → Customer emails / team notifications) so orders don't get missed. Optionally enable Stripe Tax.
3. Later (Phase 3.1): a `/api/webhook` route on `checkout.session.completed` → order-notification email (Resend) and/or auto-create the Shippo shipment.
4. Klaviyo newsletter embed — still pending, independent of checkout.

Shopify Basic (~$39/mo) stays the documented fallback if manual fulfillment / no inventory sync becomes a real problem.
