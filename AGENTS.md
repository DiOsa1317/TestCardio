# AGENTS.md

Full-stack TypeScript monorepo for "CardioLite", a cardio clinic appointment system. Two independent sub-projects; **no root `package.json`** — run all npm commands from `backend/` or `frontend/`.

## Backend (`backend/`)
- Fastify 5 + Prisma 6 + PostgreSQL 15. Entrypoint: `src/index.ts` (runs via `tsx`, `host 0.0.0.0:3000`).
- Commands: `npm run dev` (tsx), `npx prisma migrate dev` after editing `prisma/schema.prisma`, `npx prisma generate` if the client is out of sync.
- DB/Redis come up via `docker compose up` (Postgres on host port **5433**, Redis on **6380** — Redis is unused so far). The backend needs Postgres running or `/doctors` fails.
- `DATABASE_URL` lives in `backend/.env`. The file is already tracked in git despite `.gitignore` — don't commit new secrets.
- **No test framework, no lint/format config.** `npm test` is a stub that exits 1; don't rely on it.

## Frontend (`frontend/`)
- Next.js **16** (App Router) + React 19 + Tailwind v4. Code in `src/app/`; `@/*` alias maps to `src/*`.
- Commands: `npm run dev`, `npm run build`, `npm run lint` (ESLint flat config is the only linter in the repo).
- Next.js 16 differs from older training data — read the relevant guide in `node_modules/next/dist/docs/` before writing frontend code (see `frontend/AGENTS.md`).

## Cross-cutting gotcha
- Port conflict: the backend listens on `localhost:3000`, and `frontend/next.config.ts` proxies `/api/*` to `http://localhost:3000`. Next's dev server also defaults to port 3000, so both servers cannot run on 3000 at once. If you change the backend port, update the rewrite destination (and vice versa).

## Conventions
- UI copy and code comments are in Russian.
- No CI, no pre-commit hooks, no tests anywhere. Don't expect them.