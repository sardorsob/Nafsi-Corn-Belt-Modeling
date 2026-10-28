# Reading the Corn Belt

[Reading the Corn Belt: Crop History, Vegetation Timing, and Soil Moisture](../../../Reading_the_Corn_Belt.pdf)
describes the study's four analyses in 17 pages, including references and three
technical appendices. It contains 13 numbered equations, six figures, and six
tables.

Edit [Reading_the_Corn_Belt.tex](../Reading_the_Corn_Belt.tex) for manuscript text,
equations, tables, and captions, and [references.bib](../references.bib) for
citations. The [plain-text copy](../Reading_the_Corn_Belt.txt) is extracted from
the PDF; it is not a separate source for compilation.

## Build the paper

The figure assets are included, so compilation does not require rerunning the
analyses. From the repository root, with Tectonic installed:

```sh
cd artifacts/reports
mkdir -p build
tectonic -X compile --untrusted --outdir build Reading_the_Corn_Belt.tex
```

The recorded build used Tectonic 0.17.0, which runs BibTeX and the required
citation passes. First use may download TeX resources. The source is a standard
LaTeX article; compilation with another TeX distribution has not been verified.
Intermediate files stay in the ignored `build/` directory.

Inspect the generated PDF, including equations, tables, references, and the
GitHub link below the abstract. Then, from `artifacts/reports/`, replace the
three current copies:

```sh
cp build/Reading_the_Corn_Belt.pdf Reading_the_Corn_Belt.pdf
cp build/Reading_the_Corn_Belt.pdf ../../Reading_the_Corn_Belt.pdf
cp build/Reading_the_Corn_Belt.pdf ../../dashboard/public/papers/Reading_the_Corn_Belt.pdf
```

Refresh the plain-text extraction when the manuscript changes. The dashboard
serves its copy at `/papers/Reading_the_Corn_Belt.pdf`.
[verification.json](verification.json) records the supplied-manuscript hash and
PDF build checks. Those checks establish file consistency and compilation, not
independent validation of the scientific claims.

## Regenerate the figures

From the repository root, with NumPy, pandas, Matplotlib, and Pillow installed:

```sh
python artifacts/reports/rewrite/make_figures.py
```

The script reads seven saved result files, checks rotation counts and classifier
sample totals, writes five PDF/PNG figure pairs, and records input SHA-256 hashes
in [figures/source_manifest.json](figures/source_manifest.json). It does not fit
models or change result tables. LaTeX uses the vector PDFs; PNGs are previews.
The sixth figure uses the existing
[Markov transition image](../../figures/task2/task2__markov_corn_soy_other.png).
