# Gatherlane

A local-first community events demo. Events are fictional and their dates recur annually.

## Quick setup

On macOS or Linux, open a terminal and run:

```sh
curl -fsSL https://raw.githubusercontent.com/PostHog/gatherlane/main/setup.sh | bash
```

On Windows, open PowerShell and run:

```powershell
irm https://raw.githubusercontent.com/PostHog/gatherlane/main/setup.ps1 | iex
```

The scripts check for Git and Node.js, ask before installing missing prerequisites, clone the repository into a new `gatherlane` folder in your current directory, install packages, and start the app. Open the **Local** URL printed in the terminal; press Ctrl+C to stop. They require an internet connection and will not overwrite an existing folder. Git installation may require administrator permissions. Windows automatic installation requires Windows Package Manager (`winget`); unsupported systems may need manual installation.

Review the scripts before running them: [macOS/Linux](setup.sh), [Windows](setup.ps1). Downloading and running them requires access to this repository; the one-line commands work without GitHub authentication once it is public.

For later sessions, run `cd gatherlane` followed by `npm run dev`. If the macOS/Linux script installed its own Node.js, first run the `export PATH=...` command printed by the script, or install Node.js system-wide.

## Manual setup

Install Git and Node.js 20.19+ or 22.12+, then run:

```sh
git clone https://github.com/PostHog/gatherlane.git
cd gatherlane
npm ci
npm run dev
```

Run `npm test` for tests and `npm run build` for a production build. Bun and pnpm can also run the scripts (`bun install && bun run dev`, or `pnpm install && pnpm dev`). The npm lockfile is the canonical lockfile for CI.

## Deploy

Push to GitHub, then choose **Settings → Pages → Build and deployment → GitHub Actions**. The included workflow builds and deploys on pushes to `main`. Vite uses relative asset paths so the site works at a repository subpath; hash routes work on direct navigation.

## Structure and limitations

`src/domain` contains types and rules; `src/application` contains use cases and the repository interface; `src/infrastructure` provides event data and browser storage; `src/composition.ts` wires them together; `src/presentation` contains the React pages and components. No server is involved.

Saved events and registrations exist only in this browser's localStorage. Clearing site data removes them. Availability starts from fictional seeded availability and reflects only registrations in this browser; it is not shared inventory or a real reservation. No emails are sent. Events recur annually; registrations retain the date selected at booking. Corrupt data is not overwritten automatically; the app offers a reset.
