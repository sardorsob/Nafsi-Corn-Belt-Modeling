# GeoCrop

Next.js evidence website for the GeoCrop Spatiotemporal Modeling project. The
site opens directly into one source-backed analytical workspace for four
research tasks across the U.S. Corn Belt.

## Experience

- **Explore:** four shareable task tabs—phenology, rotation, extremes, and
  prediction—with controls beside the evidence they
  affect. There is no universal map or six-field global filter wall.
- **Maps:** measured regular-rotation share at state/county grain and matched
  state-grain flood/drought anomaly maps. Task 1 and Task 4 remain chart-led.
- **Evidence:** visible source paths, artifact dates, denominators, uncertainty,
  method caveats, limitations, and named missing-data states.
- **Paper:** the `Reading the Corn Belt` drawer shows the current 10-page
  manuscript, with embedded reading, open, and download actions.
- **Compatibility:** old `view=story` / `view=explore` parameters are ignored
  and removed on the next state update while valid task/filter context remains;
  retired map layers show a warning and use measured regular-rotation share.

## Local Development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. No secrets, database, backend, or remote data
service are required.

## Verification

```bash
npm run test
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=high
```

## Tech Stack

- Next.js 16.3.1, React 19, TypeScript 5.9, Tailwind CSS v4.
- Recharts for the HSGP comparator and diagnostic charts.
- D3 Geo, TopoJSON Client, and `us-atlas` for code-native Albers geography.
- Local Radix-backed UI primitives and Lucide icons.
- Static CSV/JSON artifact loading and URL-backed analytical state.
- Vitest and Testing Library.

## Data and Deployment

- Parent `../artifacts/tables/` CSV/JSON files are the result authority.
- The paper PDF is served from
  `public/papers/Reading_the_Corn_Belt.pdf`. The embedded viewer, Open PDF,
  and Download PDF all use `/papers/Reading_the_Corn_Belt.pdf`.
  Keep this file synchronized with `../Reading_the_Corn_Belt.pdf` when
  regenerating the manuscript.
- Large Parquet and GeoTIFF artifacts are not shipped to the browser.
- The target host is Vercel; project settings are not configured in this repo.

## Known Boundaries

- Task 2 geography is aggregate state/county evidence, not field or pixel
  precision. Task 3 is state-grain only.
- Task 4 is a concurrent-season diagnostic conclusion, not a pre-plant forecast,
  and has no geographic prediction layer without a supporting browser-safe
  artifact.
- The paper reader uses the browser-native PDF viewer; no viewer package was
  added.
- Automated coverage is component-level; end-to-end browser tests are not
  included.
