<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/JezzWTF/.github/main/profile/assets/banner-dark.svg">
  <img alt="JezzWTF — rebuilding the things i used to pay for" src="https://raw.githubusercontent.com/JezzWTF/.github/main/profile/assets/banner-light.svg" width="100%">
</picture>

UK-based developer building a self-hosted personal software stack — one API backend, a shared account system, and a set of web and mobile clients that sit on top of it.

Everything here is a side project. Nothing here is a startup... Yet.

### The stack

Most of what I build hangs off a single self-hosted API gateway, with a shared account system so every app uses one sign-in.

| Project | What it is |
| --- | --- |
| **api** | Self-hosted API gateway — URL shortening, paste storage, media downloading, scraping, push notifications, OCR. Projects get scoped keys; tools are enabled per project. |
| **accounts** | One identity across every app. Apps store no passwords — they receive an account ID and cache a profile. |
| **jezz.wtf** | Public site — projects, articles, and photography. Content is managed in the API's CMS and pulled at build time. |
| **pastes** | Paste and snippet app. |
| **zap** | URL shortener with click analytics. |
| **ctrl** | Web UI for managing Caddy reverse proxy config — add, edit, and reload proxies without SSH. |
| **hord** | Self-hosted note-taking, Google Keep-shaped. |
| **hanzi-path** | Duolingo-style Mandarin course, built to actually learn the language. |

### Mobile

Flutter and Kotlin clients, all talking to the same backend.

- **l8er** — self-hosted read-later and bookmarks, built after Pocket shut down
- **lob** — Pushbullet alternative for pushing links and files between devices
- **kite** — drone weather assessment: FLY / CAUTION / NO-FLY from an 8-factor forecast breakdown
- **idle** — Meta media downloader

### Desktop and tooling

- **resizer** — batch image resizer for Windows, recursive across folder trees, with presets and format conversion
- **comfyui-jezzwtf-nodes** — custom ComfyUI nodes
- **package-scripts-sorter** — VS Code extension that spots unsorted `package.json` scripts

### Working with

TypeScript · Next.js · React · Tailwind · Prisma / PostgreSQL · Dart / Flutter · Kotlin · C# · Python · Caddy · Docker

### A note on visibility

Most repositories in this org are private. A lot of them are wired to a specific self-hosted environment and would need real work to generalise before they'd be useful to anyone else. Some will open up over time; some won't.

### Elsewhere

[jezz.wtf](https://jezz.wtf) — site, writing, and photography.
