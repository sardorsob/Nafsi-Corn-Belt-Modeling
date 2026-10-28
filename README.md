# Reading the Corn Belt

## 2026 CropSmart Data Challenge — NAFSI Track 1

This project studies what grows across the 13-state U.S. Corn Belt, when crops
develop through the season, and how wet or dry their soils are. It combines
annual USDA Cropland Data Layer (CDL) labels, weekly MODIS vegetation indices,
and NASA SMAP soil moisture in four analyses: crop phenology, rotation, moisture
anomalies, and crop classification. It describes crop conditions and agreement
with CDL labels; it does not measure yield loss or recovery from extreme weather.

[Read the paper](Reading_the_Corn_Belt.pdf) for the methods, results, and technical
appendices. The 17-page manuscript has an
[editable LaTeX source](artifacts/reports/Reading_the_Corn_Belt.tex),
[plain-text copy](artifacts/reports/Reading_the_Corn_Belt.txt), and
[build guide](artifacts/reports/rewrite/README.md).

## Quick Start

| To… | Start here |
|-----|------------|
| Explore the saved results | Run the [interactive dashboard](dashboard/README.md); no Python analysis or data download is needed. |
| Examine the evidence | Read the [results summary](#key-results-summary) and its linked CSV/JSON tables. |
| Reproduce an analysis | Follow [Environment Setup](#environment-setup), [Dataset Access](#dataset-access), and the ordered [task notebooks](#running-the-experiments). |
| Edit the paper | Use the [paper build guide](artifacts/reports/rewrite/README.md). |

## Problem Description

The study covers Illinois, Indiana, Iowa, Kansas, Kentucky, Michigan, Minnesota,
Missouri, Nebraska, North Dakota, Ohio, South Dakota, and Wisconsin. The analyses
share data, but use different time windows and eligible-cell definitions.

| Task | Question | Method and scope |
|------|----------|------------------|
| **1 — Phenology** | When do corn, soybean, and winter wheat green up and peak? | A Hilbert space Gaussian process (HSGP), fitted with stochastic variational inference, describes pooled crop-level NDVI curves. Saved yearly summaries span 2008–2025. |
| **2 — Rotation** | How common is regular corn–soybean rotation? | Rules use alternation, pattern distance, run length, and crop history over 2015–2024. Eligible cells have corn or soybean in at least five years. A separate Dirichlet–Multinomial model describes uncertainty in transitions. |
| **3 — Moisture** | How unusual were soils during April–July 2019 and June–August 2022? | Weekly z-scores and a Normal–Inverse-Gamma (NIG) model compare moisture with a 2015–2021 reference, on the rotation-eligible footprint. |
| **4 — Classification** | What do seasonal observations add to crop history? | LightGBM uses CDL history, NDVI, and SMAP features. Training uses 2013–2021, validation 2022, and testing 2023. Ablations compare four feature groups on validation data. |

The rotation rule gives monoculture priority: at least seven consecutive years
of one crop or an 80% dominant-crop share. Remaining cells are regular when
corn–soy alternation is at least 0.70, pattern distance is at most three
mismatches, and at least seven years are corn or soybean. Entropy describes
sequence diversity; it is not a classification threshold. The mapped labels
use a 3×3 majority filter; the threshold sweep uses unsmoothed labels.

## Environment Setup

The analysis uses Python, JupyterLab, and the scientific/geospatial dependencies
in [requirements.txt](requirements.txt). The file specifies version ranges and
some unpinned packages, not a locked environment. Use Python 3.10–3.12 as a
starting point; compatibility across all versions has not been established.

From a local checkout:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -c "import src, numpy, pandas, rasterio; print('Imports OK')"
jupyter lab
```

On Windows PowerShell, activate with `.venv\Scripts\Activate.ps1` instead.
If native GDAL/rasterio installation fails, the dependency file describes a
conda-forge alternative. Its NumPy markers distinguish Python versions below
3.13 from 3.13 and later; those markers alone do not verify the whole stack.

Run commands from the repository root. There is no Python package build
configuration for `pip install -e .`; notebooks locate the root and import
`src/` directly.

## Dataset Access

The download script requests GeoTIFFs through Web Map Service (WMS) endpoints,
using saved service metadata under `data/external/`. Catalog coverage is defined
in [nafsi_catalog.py](src/utils/nafsi_catalog.py); each analysis uses a subset.

| Product | Source and nominal resolution | Catalog years |
|---------|-------------------------------|---------------|
| CDL | [USDA NASS CropScape](https://nassgeodata.gmu.edu/CropScape), annual 30 m crop labels | 2008–2025 |
| MODIS NDVI | [CropSmart](https://cloud.csiss.gmu.edu/CropSmart/), weekly 250 m normalized difference vegetation index | 2000–2026 |
| SMAP L4 | CropSmart, weekly 9 km surface soil moisture (m³/m³) | 2015–2025 |
| County boundaries | [U.S. Census TIGER/Line](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html) vectors, downloaded by [tiger_counties.py](src/io/tiger_counties.py) | 2024 |

State summaries use a local shapefile under `data/external/states/` when
available, otherwise Natural Earth's 1:110 million state polygons. Record the
boundary source when reproducing spatial summaries; it can affect edge cells.

Preview the requested years, then download and convert each product:

```bash
python scripts/download_data.py --dataset plan
python scripts/download_data.py --dataset cdl
python scripts/download_data.py --dataset ndvi
python scripts/download_data.py --dataset smap
python scripts/build_interim_data.py --dataset all
python scripts/process_interim_to_parquet.py --dataset cdl --source interim
python scripts/process_interim_to_parquet.py --dataset ndvi --source interim
python scripts/process_interim_to_parquet.py --dataset smap --source interim
```

Download options include `--year`, `--min-year`, `--max-year`, and `--resume`.
Confirm the plan before requesting the full catalog. Runtime and storage depend
on the selected years and remote service availability.

The pipeline is GeoTIFF → NetCDF → Parquet with JSON metadata. CDL tables have
annual `cdl_YYYY` columns; NDVI and SMAP tables have weekly `w000`, `w001`, …
columns indexed by `iy`, `ix`. Keep the spatial and time metadata with the tables
and check alignment before joining them. The converter's direct `--source wms`
route uses a different grid from the interim route; do not mix their outputs.

Native resolution is not analysis resolution. The saved rotation raster uses
EPSG:5070 (NAD83 / Conus Albers), approximately 556.7 m cells and 30.9876 ha per
cell. Resampling 9 km SMAP values onto those cells adds no spatial detail.

## Running the Experiments

**Current blocker:** [Task 1 notebook 02](notebooks/task1_ndvi_timeseries/02_ndvi_phenology_multi_year_cdl.ipynb)
contains unresolved merge-conflict markers and is not valid notebook JSON. It
needs repair before the full Task 1 sequence can run. The saved result tables
and paper remain available for inspection.

Run the numbered notebooks within each folder in order. Task 3 needs the
rotation metrics produced by Task 2 as well as processed SMAP and CDL data.
Rerunning notebooks can overwrite saved tables, models, and figures.

| Task | Notebook folder | Sequence |
|------|-----------------|----------|
| 1 | [NDVI phenology](notebooks/task1_ndvi_timeseries/) | 01 ingestion → 02 yearly summaries → 03 HSGP |
| 2 | [Crop rotation](notebooks/task2_crop_rotation/) | 01 loading → 02 metrics → 03 classification → 04 maps and area summaries |
| 3 | [Soil moisture](notebooks/task3_soil_moisture/) | 01 pixel panel → 02 reference and anomalies → 03 maps and tables |
| 4 | [Crop mapping](notebooks/task4_crop_mapping/) | 01 feature panel → 02 training and ablations → 03 SHAP and regime analysis → 04 maps |

The optional Task 4 `02b_hyperparameter_tuning.ipynb` uses Optuna. The reported
ablation results use the baseline settings; no improvement from tuning is
established by the saved results.

Task 4 also has a command-line runner for feature construction, training, and
validation/test metrics. Use the notebooks for the ablations, SHAP analysis,
and figures:

```bash
python scripts/run_task4_crop_mapping.py --config configs/task4_crop_mapping.yaml
```

`scripts/run_task2_rotation.py` prints notebook guidance; it does not execute
Task 2. The [orchestration notebook](CropSmart_NAFSI_Track1_Template.ipynb) is an
overview, but its editable-install step and `--dataset all` Parquet conversion
call are incompatible with the current repository. Use the steps above for
those operations.

## Key Results Summary

These are saved study results, with their comparison conditions. They are not
live forecasts or independently validated measures of agricultural damage.

| Task | Result | Evidence |
|------|--------|----------|
| **1** | The pooled posterior mean curves peak at day of year 204 for corn, 226 for soybean, and 147 for winter wheat. In-sample root mean squared error (RMSE) is 0.0183–0.0232 NDVI units; 90% predictive intervals cover 90.09–91.21% of the 535 observed crop-week means per crop. This does not establish performance on new years or fields. | [Curves](artifacts/tables/task1/hsgp_posterior_phenology.csv), [fit metrics](artifacts/tables/task1/model_evaluation.csv) |
| **2** | The smoothed map classifies 2,084,112 eligible cells: 27.36% regular rotation, 3.90% monoculture, and 68.74% irregular. In the separate unsmoothed threshold sweep, the regular share ranges from 28.15% to 60.33%. | [Area table](artifacts/tables/task4/task2__areal_stats_by_class__20260412.csv), [threshold sweep](artifacts/tables/task2/task2__threshold_sensitivity_grid.csv) |
| **3** | Iowa corn has mean z = +0.9145 over 2,901,150 pixel-weeks in the 2019 window. The Kentucky wheat/soy double-crop stratum has mean z = −1.5715 over 49,543 pixel-weeks in 2022; 41.96% have a lower-tail NIG score below 0.10. | [2019](artifacts/tables/task3/task3__midwest_flood_2019__anomaly_stats_by_state_crop__20260412.csv), [2022](artifacts/tables/task3/task3__plains_drought_2022__anomaly_stats_by_state_crop__20260412.csv) |
| **4** | Full-model accuracy is 79.21%, macro F1 0.7914, on 500,000 balanced 2023 test observations (125,000 per class). On the separate 2022 validation sample, accuracy is 80.59% for CDL only, 82.33% for CDL+NDVI, 80.66% for CDL+SMAP, and 82.26% for all three. | [Test metrics](artifacts/tables/task4/task4__test_metrics__20260413.json), [splits](artifacts/tables/task4/task4_split_summary.csv), [ablations](artifacts/tables/task4/task4_ablation_results.csv) |

Task 4 test accuracy varies by prior crop history: 95.55% for monoculture
(124,318 observations), 87.41% for regular rotation (65,574), and 70.92% for
irregular histories (310,108). These [regimes](artifacts/tables/task4/task4_regime_stratified_metrics.csv)
use histories before 2023, so they differ from the 2015–2024 rotation map.
The largest [mean absolute SHAP values](artifacts/tables/task4/task4_shap_feature_importance.csv)
belong to the previous year's CDL code, mid-season NDVI mean, and NDVI peak week.
SHAP (Shapley additive explanations) describes feature contributions to model
predictions, not causal effects.

## Expected Outputs and Directory Structure

| Location | Contents |
|----------|----------|
| [src/](src/), [scripts/](scripts/), [notebooks/](notebooks/) | Shared Python functions, command-line tools, and analyses |
| [configs/](configs/) | Study extent, task settings, model parameters, and output paths |
| `data/raw/`, `data/interim/`, `data/processed/` | Local downloads, stacks, and analysis tables; excluded from Git |
| [data/external/](data/external/) | Service metadata and local boundary caches |
| [artifacts/figures/](artifacts/figures/), [artifacts/tables/](artifacts/tables/) | Saved figures and CSV/JSON results; most are grouped by task. Task 2 area summaries are under `tables/task4/`. |
| [artifacts/models/task4/](artifacts/models/task4/) | Saved crop classifier; optional tuned model is produced only by the tuning notebook |
| [artifacts/reports/](artifacts/reports/) | Editable manuscript, bibliography, extracted text, and generated PDFs |
| [dashboard/](dashboard/) | Interactive presentation of saved tables and the paper |
| [resources/](resources/) | Challenge brief and reference literature |

## Configuration and Reproducibility

Task YAML files define many settings, including rotation thresholds, moisture
event windows, classifier splits, and output paths. They are not a complete
record of every parameter: HSGP fitting settings and other choices also live in
notebook cells or Python defaults. Read the notebook alongside its config when
changing an experiment.

Retain the input versions, metadata, environment, settings, and random seeds
when comparing runs. Dated result filenames identify specific exports, but
some outputs use fixed filenames and can be overwritten. The paper's
[figure-source manifest](artifacts/reports/rewrite/figures/source_manifest.json)
records hashes of the seven inputs used for its generated panels.
Task 2 notebook 04 and Task 3 notebook 03 also write local `run_bundle.json`
records under `artifacts/logs/runs/`; retain these with the inputs for a rerun.

## Testing and Validation

The notebooks contain fit diagnostics, confusion matrices, ablations, and
other analysis checks. The [dashboard guide](dashboard/README.md#verification)
lists its automated checks. A complete fresh-environment reproduction is not
established by the saved outputs alone.

Important interpretation limits:

- **Spatial support:** the rotation denominator includes 66,107 cells outside
  the 13 state polygons, about 3.17% of the buffered raster footprint. State
  summaries exclude them. Coarse-cell area is not a direct USDA acreage estimate.
- **Uncertainty:** HSGP fit checks are in sample. The Dirichlet–Multinomial
  rotation score concerns transition probabilities; it is not a calibrated
  probability that the rule-based rotation label is correct.
- **Moisture:** the reference has at most seven observations per cell and ISO
  week and includes the 2019 event itself. `nig_p_drought` is a Student-t
  predictive cumulative probability at the observed moisture: near zero means
  unusually dry, near one unusually wet. It is not the probability of drought
  or crop damage. Pixel-weeks sharing a SMAP cell are not independent readings.
- **Crop labels:** the Task 3 tables call CDL code 26 `winter_wheat`; that code
  denotes winter wheat/soybean double crop. Tasks 1 and 4 use code 24 for winter
  wheat. Keep that distinction when comparing tasks.
- **Classification:** the target is another satellite product, CDL, rather than
  field-survey truth. Class-balanced accuracy does not estimate landscape-wide
  accuracy. Current-season inputs make this a retrospective classification
  study, not a pre-plant forecast. Training and test paths construct NDVI
  history and SMAP features differently; the effect has not been quantified.
  SMAP features are missing for the 2013–2014 training rows.

## Sources and License

The [challenge brief](resources/CropSmart_NAFSI_Track1_Challenge_Brief.docx.pdf)
defines the task, and the paper's [bibliography](artifacts/reports/references.bib)
credits the methods and data products. Data come from USDA NASS, NASA/MODIS,
NASA SMAP, CropSmart, and the U.S. Census Bureau.
Natural Earth supplies the fallback state boundaries.

This repository does not include a code license or a consolidated record of
dataset reuse terms. Public data access does not specify those terms; consult
the original providers and reference publications before redistribution.
