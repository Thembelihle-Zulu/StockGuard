# StockGuard — Web App (React)

Frontend for **StockGuard**, a livestock insurance platform for South African
farmers: farmers register a farm and animals, each animal is vet‑inspected and
value‑verified, a policy is priced from the verified herd value, and — once paid —
claims can be filed against approved animals. Admin (insurer staff) review
inspections and claims across every farm.

- **This repo (React):** the UI below
- **Backend (Flask API + SQL Server):** `stockguard-api-flask`
- Plain‑English walkthrough of the whole product: [`HOW_STOCKGUARD_WORKS.md`](HOW_STOCKGUARD_WORKS.md)

---

## Stack

| Concern | Choice |
|---|---|
| Build | Vite 8, React 19 (React Compiler enabled) |
| UI | Material UI (`@mui/material`), `@mui/x-date-pickers`, custom CSS in `src/styles/` |
| Forms & validation | Formik + Yup |
| Routing | `react-router` (`BrowserRouter`) |
| Lint/format | Oxlint / Oxfmt (`.oxlintrc.json`) |
| Package manager | Bun (`bun.lock`) — npm also works |

---

## Prerequisites

- Node.js 20+ **or** [Bun](https://bun.sh) 1.1+
- The StockGuard Flask API running locally (see `stockguard-api-flask`) — the app
  expects it at `http://127.0.0.1:5000`.

---

## Environment variables

Copy `.env.example` to `.env`:

```
# Public API base used by the browser
VITE_API_URL=http://localhost:5000/api
```

> Note: `src/utils/api.js` and `src/utils/uploadFile.js` currently hard‑code
> `http://127.0.0.1:5000`. Point these at `import.meta.env.VITE_API_URL` before
> deploying to anything other than localhost.

No secrets belong in this file — everything here is shipped to the browser.

---

## Install & run

```bash
bun install          # or: npm install
bun run dev          # or: npm run dev   → http://localhost:5173
```

Other scripts:

| Script | Does |
|---|---|
| `bun run build` | Production build to `dist/` |
| `bun run preview` | Serve the built `dist/` locally |
| `bun run lint` | Oxlint |

---

## App structure

```
src/
  main.jsx            # BrowserRouter + app mount
  App.jsx             # routes + ProtectedRoute / AdminOnlyRoute guards
  pages/              # route-level screens (Home, Login, Signup, Onboarding,
                      #   dashboard, admin/*)
  component/          # reusable UI (modals, cards, steppers, filters, tables)
  component/admin/    # admin tables & filters
  utils/
    api.js            # apiFetch() — attaches JWT, redirects on 401
    uploadFile.js     # multipart upload helper
    Premuimcalculator.js   # premium = insured value × rate × coverage tier
    insuranceReadiness.js  # single source of truth for the readiness dashboard
    exportCsv.js      # admin list → CSV download
  styles/             # per-area CSS
```

### Routes

| Path | Screen | Guard |
|---|---|---|
| `/` | Marketing home | — |
| `/login`, `/signup` | Auth | — |
| `/onboarding` | Farm profile → register animals → inspection → select cover → pay | token |
| `/dashboard` | Farmer dashboard (readiness, livestock, inspections, policies, claims, reports, profile) | token |
| `/admin` | Admin dashboard (review queue, portfolio tables, reports) | token + `role === "ADMIN"` |

Auth state lives in `localStorage` (`token`, `role`). `apiFetch` clears it and
redirects to `/login` on any `401`.

---

## Key UI behaviours worth knowing

- **Registering an animal auto‑chains into its inspection** — no separate step to forget.
- **The readiness dashboard is computed from real API data** (`insuranceReadiness.js`),
  not hard‑coded, and every card derives from that one call so numbers can't drift.
- **Ineligible animals are disabled in the claim form** with the reason inline —
  and the same check re‑runs server‑side, so a raw API call can't bypass it.
- **Payments are clearly labelled as a mock** in the UI. No real gateway is wired in.

---

## Related docs in this repo

| File | Purpose |
|---|---|
| `HOW_STOCKGUARD_WORKS.md` | Non‑technical end‑to‑end walkthrough |
| `BUSINESS_CONTEXT_DUMP.md` | Problem research, business rules, design decisions |
| `PRESENTATION_OUTLINE.md` / `SLIDE_CONTENT.md` / `PRESENTATION_SCRIPT.md` | Capstone presentation material |

## Deployment

Docker, GitHub Actions, Terraform and AWS are tracked separately and not part of
this README.
