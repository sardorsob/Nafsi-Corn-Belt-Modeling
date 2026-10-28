# Nafsi2026

This dashboard lets readers explore the Corn Belt study's saved results:
seasonal vegetation curves, crop rotation, soil moisture anomalies, and crop
classification. It reads the repository's CSV/JSON tables and includes the
[paper](../Reading_the_Corn_Belt.pdf). It does not run models or fetch live
satellite observations.

## Experience

- **Phenology:** compare crop NDVI curves and seasonal windows, with uncertainty
  and fit diagnostics.
- **Rotation:** explore regular-rotation shares by state or county and compare
  classification thresholds.
- **Extremes:** compare state-level moisture summaries for the 2019 wet season
  and 2022 dry spell.
- **Prediction:** inspect feature-group comparisons, confusion matrices,
  feature attribution, and accuracy by crop-history regime.
- **Paper:** read the manuscript in a drawer, open it in a separate tab, or
  download it.

Task and filter selections are stored in the URL for sharing. Panels show source
paths, export dates, denominators, and interpretation notes; missing artifacts
produce explicit unavailable/error states.

## Local Development

Keep the full repository checkout: the app reads tables from `../artifacts/`.
Use Node.js 22 (22.12 or later) or 24+, with npm, to satisfy the locked app and
test dependencies. From the repository root:

```bash
cd dashboard
npm ci
npm run dev
```

Open <http://localhost:3000>. The app needs no database, API credentials, or
remote data service. The Python analysis environment is unnecessary for viewing
the saved results.

## Verification

Run inside `dashboard/`:

```bash
npm run test
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=high
```

Tests cover components, data normalization, selectors, and URL state. They do
not include an end-to-end browser suite or validate the underlying scientific
analyses. After building, `npm start` serves the production app locally.

## Tech Stack

- Next.js 16.3.1 (locked version), React 19, TypeScript 5.9, Tailwind CSS v4.
- Recharts for plots; D3 Geo, TopoJSON Client, and `us-atlas` for Albers maps.
- Radix UI primitives and Lucide icons; Vitest and Testing Library.

## Data and Deployment

[sources.ts](src/lib/data/sources.ts) lists the result files and their scope.
[loaders.ts](src/lib/data/loaders.ts) reads them from the filesystem on the
server; normalized summaries are passed to the interactive components.
Large Parquet and GeoTIFF files are not sent to the browser. When replacing
results, check the expected columns, units, denominators, and export dates in
the source definitions.

The embedded reader, Open PDF, and Download PDF actions all use
`/papers/Reading_the_Corn_Belt.pdf`, served from
[public/papers/Reading_the_Corn_Belt.pdf](public/papers/Reading_the_Corn_Belt.pdf).
Keep it synchronized with the root paper using the
[paper build guide](../artifacts/reports/rewrite/README.md).

Vercel is the intended host, but host project settings are not defined here.
A deployment must include the referenced tables outside `dashboard/` and the
public PDF. Deploying the dashboard directory alone omits its data sources.

## Known Boundaries

- Rotation maps summarize eligible cells within states/counties, not individual
  fields. Moisture maps are state-level summaries of a crop-history-selected
  footprint, not mapped flood extent or drought damage.
- Crop classification uses current-season inputs and CDL reference labels;
  it is not a pre-plant forecast. There is no geographic prediction layer.
- The PDF reader depends on the browser's built-in viewer; Open PDF and Download
  PDF provide alternatives.
- Older `view=story` / `view=explore` parameters are removed when state changes.
  Retired map-layer selections show a warning and fall back to measured
  regular-rotation share.

See the [study's validation limits](../README.md#testing-and-validation) before
interpreting the displayed scores.
