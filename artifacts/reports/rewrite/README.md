# Reading the Corn Belt

The main paper is [Reading the Corn Belt: Crop History, Vegetation Timing, and Soil Moisture](../../../Reading_the_Corn_Belt.pdf), with [LaTeX source](../Reading_the_Corn_Belt.tex), [plain text](../Reading_the_Corn_Belt.txt), and a [bibliography](../references.bib). The 2026-10-14 revision follows the user-supplied NAFSI manuscript, including its expanded methodology, 13 numbered equations, six figures, six tables, and three technical appendices. It is 17 pages including references and appendices, using 10 pt Times body text and one-inch margins.

Current PDF copies use the meaningful filename `Reading_the_Corn_Belt.pdf` at the repository root, in `artifacts/reports/`, and in the dashboard's `public/papers/` directory.

All manuscript text is now in `Reading_the_Corn_Belt.tex`; the superseded section fragments were removed. Edit that file for future revisions. The imported NAFSI filename was removed after regeneration and verification. Its SHA-256 and the current output checks are recorded in [verification.json](verification.json). Earlier review files describe the September condensation and do not certify the October manuscript's scientific claims.

## Build the paper

The checked-in figure assets are sufficient to compile. From the repository root, with Tectonic installed:

```sh
cd artifacts/reports
mkdir -p build
tectonic -X compile --untrusted --outdir build Reading_the_Corn_Belt.tex
```

Tectonic 0.17.0 was used for this revision. It runs BibTeX and the required citation passes automatically. On first use, it may download TeX resources. A conventional LaTeX/BibTeX installation can also compile this standard article; that route was not tested here. Build products stay in the ignored `build/` directory. After checking the result, synchronize `Reading_the_Corn_Belt.pdf` in the three current locations above. The plain-text file is a PDF extraction for reading, not an alternate manuscript source.

## Regenerate the figures

From the repository root, in a Python environment containing NumPy, pandas, Matplotlib, and Pillow:

```sh
python artifacts/reports/rewrite/make_figures.py
```

The script reads seven saved result files, checks key counts, writes five PDF/PNG pairs, and records SHA-256 input hashes in [figures/source_manifest.json](figures/source_manifest.json). The sixth figure uses the existing `artifacts/figures/task2/task2__markov_corn_soy_other.png` directly. The input artifacts are already in the repository. No models are fitted and no source result tables are changed. PNGs are convenient previews; LaTeX uses the PDF figures for the five regenerated panels.
