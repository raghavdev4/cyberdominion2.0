# Cyber Dominion

Cyber Dominion is a safe, simulated cybersecurity learning command center for a college capstone MVP. It teaches ten progressive concepts without executing shell commands, touching the host filesystem, attacking networks, or connecting to real targets.

## Stack
React + Vite + JavaScript, Express, JWT, bcryptjs, mysql2/promise, and MySQL. The API automatically falls back to an in-memory store when MySQL is unavailable.

## Run
1. Copy `.env.example` to `.env` and set `JWT_SECRET`.
2. Run `npm run install:all`.
3. Optional: initialize MySQL with `schema.sql`.
4. Start API: `npm run dev:server`.
5. In another terminal start UI: `npm run dev:client`.

The frontend runs on Vite's printed local URL and the API defaults to `http://localhost:4000`.

## MVP flow
Register, sign in, open Level 1, use the controlled simulated terminal to complete its task, earn XP and coins, and unlock the next level. Completing Level 10 gates the Dual Mode and Clan Mode navigation surfaces. Progress is stored in MySQL when configured, otherwise in memory for the server session; the client also has a local demo fallback for UI work without an API.

## API
`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/levels`, `GET /api/levels/:id`, `GET /api/labs/:id`, `GET /api/progress`, `POST /api/progress`, and `GET /api/achievements`.

## Safety model
Terminal commands are matched against a fixed allowlist and return predefined strings. No child processes, shell execution, real filesystem access, external targets, multiplayer, Docker, malware, credential theft, or real exploitation are implemented.

## Structure
`client/` contains the React UI, routing, context, and API adapter. `server/` contains Express routes, JWT middleware, database fallback, and simulated lab services. `schema.sql` contains the relational model and five seeded levels.

## Future work
Add instructor tools, richer task authoring, persistent achievement awarding, multiplayer-ready event abstractions, and Docker deployment without changing the simulation safety boundary.
