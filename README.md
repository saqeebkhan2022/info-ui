# InfoPanel – Responsive React Frontend

Frontend-only package. This keeps all existing API integration, routes, permissions, and forms. No backend changes.

## Responsive improvements
- Mobile navigation drawer with backdrop, Escape-to-close, and body scroll lock.
- Responsive login and accessible mobile-size fields.
- Dashboard KPIs: 3 columns desktop, 2 columns mobile, 1 column on narrow phones.
- Dashboard date filters, monthly income chart with horizontal scroll.
- Users, Brokers, Pools, Clients, Operations and Roles tables switch into readable mobile record cards with edit/delete actions.
- Responsive filters, pagination, modal dialogs, input forms and headers.
- Tablet layout improvements and dark-mode mobile table styling.

## Run locally

```bash
npm ci
npm run dev
```

Use `.env`:

```env
API_PROXY_TARGET=http://localhost:3000
FRONTEND_PORT=5173
VITE_API_URL=
```

Then open http://localhost:5173. Backend remains unchanged and should run at localhost:3000.

## Deploy on Render Static Site

Repo contains this frontend folder at its root:
- Root Directory: empty
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-BACKEND.onrender.com`
- React Router rewrite: `/*` -> `/index.html` (Rewrite)

After changing `VITE_API_URL`, rebuild/redeploy. The generated `dist/` is excluded from this source ZIP. Render builds it from source during deployment.

## Security

No backend credentials are included. Keep JWT signing secrets and database URLs in backend environment variables only.

## Notes

- This is a **frontend-only** update. No backend, PostgreSQL, API contract, authentication, or route changes are required.
- UI build was verified using `npm run build`. A browser/device compatibility pass with authenticated data is still recommended.
- Mobile breakpoints: 767px drawer/card tables; 420px compact controls; 350px single-column KPI cards.
- Never commit `.env` to a public GitHub repository. Copy `.env.example` to `.env` for local use.
