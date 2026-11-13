# VideokePH 🎤 Kanta Na!

A browser-based Filipino videoke songbook, saved singing queue and machine-code reference directory.

**Published URL listed for this repository:** https://videoke-six.vercel.app
**Release verification:** confirm the owning deployment and public browser before treating a successful GitHub status as a published update.

## Implemented features

- Search and browse a curated set of OPM, P-Pop, AJ Originals, bands, party and English song titles. The song count is computed from the bundled catalog rather than promised as a live count.
- Filter, sort, favorite, and reserve songs for a local queue. Singer names, favorites, queue and counter survive reloads when browser storage is available.
- Look up machine/songbook code references and save custom brand/model entries locally. **Custom entries are not independently verified** and must be checked against the exact machine catalog.
- Navigate directly to `/#book`, `/#queue`, and `/#codes`; Back, Forward and reload retain the selected section.
- Offline packaging preserves the static interface and existing local data; external destinations such as AJ Originals on Suno require internet.

The current checked-in interface does **not** implement microphone scoring, an on-screen coin-operated remote, music playback or a Hall of Fame. A local coin counter is demonstrative and does not collect payments.

## Storage and privacy

Browser-local workspace key: `videokeph.unified.v1`. If data is malformed or browser storage is unavailable, the application displays an error and refuses to overwrite the existing saved record. No song queue or singer information is submitted to a backend by this static interface.

## Development and checks

No runtime framework is required. Serve the repository through a local static server:

```bash
python3 -m http.server 4725 --directory .
```

Browse http://localhost:4725. For repository-provided checks:

```bash
node --test tests/videoke-quality.test.mjs
npm run test:offline
npm run build
```

The web-quality GitHub Actions workflow additionally installs Chromium and checks responsive layouts, keyboard navigation, hash deep-links and local-data preservation. It is source CI, **not** automatic certification of the deployed public URL.

## Deployment

The existing Vercel deployment is configured in `vercel.json`. Only its authorized owner should deploy or change settings. The existing GitHub Pages workflow requires GitHub Pages to be enabled/configured by a repository owner; a failing Pages action does not imply that Vercel is also failing.
