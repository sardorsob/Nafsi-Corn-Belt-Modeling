# Reading the Corn Belt

The main paper is [Reading the Corn Belt: Crop History, Vegetation Timing, and Soil Moisture](../../../Reading_the_Corn_Belt.pdf), with [LaTeX source](../Reading_the_Corn_Belt.tex), [plain text](../Reading_the_Corn_Belt.txt), and a [curated bibliography](../references.bib). It retains all four analyses in 10 pages, including references, using 11 pt body text, 10 pt references, and one-inch margins. The five figures and two tables replace repeated panels and long result inventories.

Current PDF copies use the meaningful filename `Reading_the_Corn_Belt.pdf` at the repository root, in `artifacts/reports/`, and in the dashboard's `public/papers/` directory.

## Build the paper

The checked-in figure PDFs are sufficient to compile. From the repository root, with Tectonic installed:

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

The script reads seven saved result files, checks key counts, writes five PDF/PNG pairs, and records SHA-256 input hashes in [figures/source_manifest.json](figures/source_manifest.json). The input artifacts are already in the repository. No models are fitted and no source result tables are changed. PNGs are convenient previews; LaTeX uses the PDF figures.
