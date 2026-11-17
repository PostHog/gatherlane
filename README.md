# Gatherlane

A local-first community events demo. Events are fictional and their dates recur annually.

## Run

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
npm test
npm run build
```

Bun and pnpm can also run the scripts (`bun install && bun run dev`, or `pnpm install && pnpm dev`). The npm lockfile is the canonical lockfile for CI.

## Deploy

Push to GitHub, then choose **Settings → Pages → Build and deployment → GitHub Actions**. The included workflow builds and deploys on pushes to `main`. Vite uses relative asset paths so the site works at a repository subpath; hash routes work on direct navigation.

## Structure and limitations

`src/domain` contains types and rules; `src/application` contains use cases and the repository interface; `src/infrastructure` provides event data and browser storage; `src/composition.ts` wires them together; `src/presentation` contains the React pages and components. No server is involved.

Saved events and registrations exist only in this browser's localStorage. Clearing site data removes them. Availability starts from fictional seeded availability and reflects only registrations in this browser; it is not shared inventory or a real reservation. No emails are sent. Events recur annually; registrations retain the date selected at booking. Corrupt data is not overwritten automatically; the app offers a reset.
