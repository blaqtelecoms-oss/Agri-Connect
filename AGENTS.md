# AGENTS.md

## Project Context

This is a Base44 app repository. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and publish workflow.

## Base44 References

- CLI overview: https://docs.base44.com/developers/references/cli/get-started/overview.md
- Agent skills: https://docs.base44.com/developers/backend/overview/skills.md

If your agent supports Agent Skills, install or update Base44 skills before Base44-specific work:

```bash
npx skills add base44/skills
```

## Key Files

- `src/`: frontend application source.
- `src/api/base44Client.js`: frontend Base44 SDK client.
- `vite.config.js`: Vite config and Base44 Vite plugin setup.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- Use `base44 dev` as the default local development command when you need the local Base44 backend. It can run the backend and frontend together.
- When docs or code mention the frontend being started automatically, that usually means the Base44 project config includes `site.serveCommand`, for example `"serveCommand": "npm run dev"` in `base44/config.jsonc`.
- Use `npm run dev` only for frontend-only work against the hosted Base44 backend.
- Prefer the existing Base44 CLI workflow over adding new npm scripts for Base44-specific tasks.
- Reuse the existing SDK client and Vite plugin patterns before adding new Base44 integration paths.
- Run the relevant checks from `package.json` before finishing code changes.

## Base44 sandbox environment (docker compose)

`docker compose -f docker-compose.base44.yml up -d --build` runs the frontend dev
server (`npm run dev`, Vite) from the cloned source on host port 3000, so edits
hot-reload. Dependencies are installed inside the container on first start, and
again whenever `package-lock.json` is newer than `node_modules/.base44-installed`.

The frontend is the whole app: routing, screens and sign-in are client side.
The Base44 SDK client (`src/api/base44Client.js`) needs a Base44 backend
(`VITE_BASE44_APP_ID` + `VITE_BASE44_APP_BASE_URL`). Without one, the Vite plugin
logs `No Base44 backend configured` and every `/api/...` request 404s, so
entity-backed lists render empty. Sign-in in this prototype is local
(`src/lib/agriAuth.js` keeps the demo session in localStorage), so the farmer and
municipal portals are reachable without a backend.

What needs the backend:

- `src/pages/admin/_admin.jsx` — `useCounts` (admin counters). List queries fall
  back to sample rows in `src/pages/admin/_adminSampleData.js`.
- `src/pages/farmer/_shared.jsx` — list queries (farms, applications, service
  types, notifications, incidents) fall back to sample rows in
  `src/pages/farmer/_farmerSampleData.js` when the backend is unreachable.
- `src/pages/farmer/Services.jsx` — `apply` records the submission in the local
  sample fallback (`addSampleApplication`/`addSampleNotification`) when the
  entity `create` fails, so the apply flow works end to end without a backend.
- `src/pages/farmer/Report.jsx` — incident `create` has no `catch`, so without a
  backend a submit silently does nothing (no success screen, no visible error).

Running with a backend (from inside the container):

```bash
docker compose -f docker-compose.base44.yml exec web sh -c "npx base44@latest login"   # device code, approve in a browser
docker compose -f docker-compose.base44.yml exec web sh -c "npx base44@latest dev"     # local backend: in-memory entities, wiped on restart
docker compose -f docker-compose.base44.yml exec web sh -c "npx base44@latest dev --remote"  # your app's real data — writes are real
```

`base44 dev` serves the frontend itself (see `site.serveCommand` in
`base44/config.jsonc`), so stop the `web` service first to free port 3000. The
local dev server needs Deno only for backend functions; this app has none.

Sandbox wiring notes:

- `BASE44_PREVIEW_MODE` and `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` are passed
  through to the `web` service. The app itself does not read either; Vite uses the
  second to accept the preview proxy host.
- `agri-connect-emfuleni.zip` is the archive the source was extracted from and is
  unused at runtime.

Verify a boot with `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/`
(200) and `docker compose -f docker-compose.base44.yml logs web`, which should show
live Vite compilation (`VITE v8.x ready`).
