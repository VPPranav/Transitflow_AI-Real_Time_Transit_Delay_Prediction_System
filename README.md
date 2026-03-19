# TransitFlow AI — Real-Time Transit Delay Prediction System

> **Enterprise-grade transit intelligence platform** combining a physics-informed ensemble ML model, a Claude AI second-layer reasoning engine, a live 3D animated city transit map, and a full 9-chart analytics suite — all delivering predictions in under 3 seconds.

---

## Table of Contents

- [Project Overview](#-project-overview)
- [What's New](#-whats-new)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Running the Application](#-running-the-application)
- [API Reference](#-api-reference)
- [ML Model & Feature Engineering](#-ml-model--feature-engineering)
- [Local Ensemble Model](#-local-ensemble-model)
- [AI Second-Layer (Claude)](#-ai-second-layer-claude)
- [Frontend Pages](#-frontend-pages)
- [Visualisation Suite](#-visualisation-suite)
- [Dataset](#-dataset)
- [Model Training](#-model-training)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📌 Project Overview

TransitFlow AI is a full-stack machine learning application that forecasts public transport delays based on real-world operational conditions — weather, traffic congestion, events, time of day, and seasonal factors.

The system operates through a **three-layer pipeline**:

1. **Ensemble ML Layer** — A physics-informed local model (plus optional FastAPI RandomForest backend) produces a robust baseline delay estimate from 24+ engineered features.
2. **AI Reasoning Layer** — A Claude AI second-pass applies probabilistic compounding, cascade effect modeling, and operational heuristics to refine the prediction and generate actionable intelligence.
3. **3D Visualisation Layer** — A live isometric city canvas renders the transit network risk state in real time, with animated vehicles, congestion heatmap overlays, and weather particle effects.

The result is a **complete operational intelligence briefing** — not just a delay number, but a risk score, confidence interval, SLA compliance flags, recommended actions, cascade effects, optimal departure window, and a full 9-chart analytics suite — delivered in under 3 seconds.

---

## 🆕 What's New

The following four major enhancements were added in the latest release:

### 1. Physics-Informed Ensemble Model (upgraded `predict.ts`)

The previous simple linear heuristic fallback has been completely rebuilt into a **5-component physics-informed ensemble**:

| Component | Description |
|---|---|
| **Traffic × Weather Interaction** | Nonlinear multiplicative term with a sigmoid wet-road multiplier (Rain, Snow, Storm increase sensitivity at high congestion) |
| **Temporal Demand Curve** | Bimodal AM/PM peak demand using a Gaussian-shaped curve (peaks at 08:00 and 17:30), with per-weekday multipliers (Mon/Fri boosted, Sat/Sun reduced) and holiday discount |
| **Environmental Stress** | Sigmoid-scaled penalties for freezing temperature (<5°C), extreme heat (>35°C), dangerous wind speed (>45 km/h), and high humidity (>80%) |
| **Event Pressure** | Logarithmic attendance scaling — `log₁₀(attendance)` — preventing linear blow-up at large crowds; saturation cap applied |
| **Seasonal Baseline** | Fixed seasonal modifier with a compound penalty for Winter + Snow/Storm combinations |
| **Calibration Correction** | Empirical residual correction for known edge cases (holiday under-prediction, extreme heat over-prediction, etc.) |

When the FastAPI backend is reachable, its `RandomForestRegressor` prediction is **blended 80% backend / 20% local** for maximum robustness. When offline, the local ensemble runs standalone.

---

### 2. 3D Animated Transit Network Map (new `TransitMap3D` component)

An isometric city canvas rendered entirely in Canvas 2D API — no third-party 3D library required:

- **14 buildings** with three distinct isometric faces (lit top, shadowed side, gradient front) and animated window lights.
- **3 transit routes** — one primary solid route, two secondary dashed routes — coloured by current risk level (green → yellow → orange → red).
- **Animated vehicles** travelling the primary route; speed is inversely proportional to congestion index.
- **Radial congestion heatmap** pulsing at 4 intersection nodes; a 5th event hotspot node appears when an event is active.
- **Weather particle effects** — diagonal rain streaks for Rain/Storm conditions, drifting snowflakes for Snow.
- **Live risk overlay panel** (top-right of canvas) showing current AI-adjusted delay and risk level badge.
- The entire map re-renders whenever inputs change. Uses `requestAnimationFrame` with proper `cancelAnimationFrame` cleanup.

---

### 3. Enhanced 3D Isometric Heatmap (rebuilt `HourlyHeatmap3D` component)

The previous flat 2D bar chart has been rebuilt as a proper **isometric 3D volumetric heatmap**:

- Each bar has three rendered faces: **lit top**, **shadowed right face**, and **gradient-filled front face** — giving true 3D depth.
- **5-tier colour coding**: cyan (<5 min) → green (5–9 min) → yellow (10–14 min) → orange (15–19 min) → red (≥20 min).
- **DPR-aware** canvas rendering (uses `window.devicePixelRatio`) for pixel-perfect output on HiDPI/Retina displays.
- **ResizeObserver** ensures the chart redraws when the container changes width.
- **"NOW" marker** with glow effect highlights the current hour input. Value labels float above tall bars.
- Hour labels rendered every 2 hours on the X-axis. Y-axis gridlines with delay values in minutes.

---

### 4. Live Input Snapshot Panel (new `LiveInputSummary` component)

A persistent panel that **always appears below the prediction pipeline tracker** — filling the previously empty space — and updates in real time as the user changes any form field, without requiring a prediction run:

- **Pulsing "LIVE INPUT SNAPSHOT" header** with current weekday and hour displayed.
- **Weather condition card** — contextual icon (Sun / CloudRain / CloudSnow) with colour that matches the selected condition.
- **Congestion progress bar** — colour transitions green → amber → red as congestion rises, with a severity badge (LIGHT / MODERATE / CRITICAL).
- **4 environmental mini-stats**: Temperature, Humidity, Wind Speed, Precipitation — each with an alert highlight when the value crosses a threshold (e.g. temp <5°C, wind >45 km/h, precip >10 mm).
- **Status chips**: PEAK HOUR / OFF-PEAK, HOLIDAY / WORKDAY, EVENT TYPE with attendance — shown contextually based on current inputs.
- **Model input token bar**: 8 key inputs rendered as monospace tag-style chips, always reflecting the live form state.

---

## 🏗 Architecture

```
User Input (13+ fields)
        │
        ▼
┌───────────────────────────────────┐
│        LAYER 1: ENSEMBLE ML       │
│  ┌────────────────┐               │
│  │ Local Ensemble │ ──80/20 mix── │──► Baseline Delay (min)
│  │ (predict.ts)   │               │
│  └────────────────┘               │
│  ┌─────────────────────────────┐  │
│  │ FastAPI RandomForestRegressor│  │
│  │ (app.py) — optional backend  │  │
│  └─────────────────────────────┘  │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│      LAYER 2: AI REASONING        │
│  Deterministic in-browser:        │
│  • Risk score (0–100)             │
│  • Confidence interval            │
│  • Radar data, risk breakdown     │
│  • Departure window               │
│                                   │
│  Claude Haiku API call:           │
│  • Executive summary              │
│  • Operational recommendations    │
│  • Cascade effects                │
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│   LAYER 3: VISUALISATION SUITE    │
│  • 3D isometric transit map       │
│  • 3D volumetric heatmap          │
│  • Live input snapshot panel      │
│  • 9 Recharts analytics charts    │
│  • Risk gauge, SLA flags, cards   │
└───────────────────────────────────┘
```

---

## 🛠 Technology Stack

### Backend

| Technology | Role |
|---|---|
| **FastAPI** | High-performance REST API framework |
| **Uvicorn** | ASGI server for FastAPI |
| **scikit-learn** | `RandomForestRegressor` ML model |
| **pandas** | Data manipulation and preprocessing |
| **joblib** | Model serialization (`delay_model.pkl`, `features.pkl`) |
| **Pydantic** | Request validation and schema enforcement |

### Frontend

| Technology | Role |
|---|---|
| **React 18 + TypeScript** | UI library with full type safety |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling with custom glass morphism |
| **Recharts** | 9 analytics chart types (area, bar, radar, composed, line) |
| **Canvas 2D API** | 3D isometric transit map + 3D volumetric heatmap |
| **Radix UI / shadcn/ui** | Accessible component primitives |
| **lucide-react** | Icon library |

### AI / ML

| Technology | Role |
|---|---|
| **Anthropic Claude Haiku** | AI second-layer text reasoning (summaries, recommendations, cascade effects) |
| **Local Ensemble Model** | Physics-informed 5-component fallback / blend model (`predict.ts`) |

---

## 📁 Project Structure

```
ai_transit_delay_detection/
├── backend/
│   ├── app.py                    # FastAPI application — /predict endpoint
│   ├── check_features.py         # Feature column validation
│   ├── check_features2.py        # Additional feature inspection utilities
│   ├── check_joblib.py           # Joblib model integrity checker
│   ├── delay_model.pkl           # Trained RandomForestRegressor model
│   ├── features.pkl              # Feature engineering pipeline (encoder)
│   ├── requirements.txt          # Python dependencies
│   └── out*.txt                  # Server output logs
│
├── dataset/
│   └── public_transport_delays.csv   # Training and evaluation dataset
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Shared UI components (nav, theme toggle, etc.)
│   │   ├── lib/
│   │   │   └── predict.ts        # ★ Physics-informed ensemble model + API bridge
│   │   ├── pages/
│   │   │   ├── Predict.tsx       # ★ Main prediction page (all 3 visualisation layers)
│   │   │   ├── Home.tsx          # ★ Landing page
│   │   │   └── About.tsx         # ★ Architecture & documentation page
│   │   └── test/                 # Unit tests
│   ├── public/                   # Static assets (logo, hero image)
│   └── package.json              # Frontend dependencies
│
├── notebook/
│   └── model_training.ipynb      # Full training pipeline notebook
│
└── README.md
```

> ★ = recently updated or newly added

---

## 🚀 Getting Started

### Prerequisites

- Python **3.8+**
- Node.js **16+**
- npm or yarn
- An **Anthropic API key** (for the AI second-layer; the app works without it using deterministic fallbacks)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Key Python dependencies in `requirements.txt`:

```
fastapi
uvicorn
pandas
scikit-learn
joblib
pydantic
python-dotenv
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
VITE_ANTHROPIC_API_KEY=your_claude_api_key_here
```

Create a `.env` file in the `backend/` directory:

```env
MODEL_PATH=./delay_model.pkl
FEATURES_PATH=./features.pkl
```

> **Note:** The Anthropic API key is used client-side for the Claude AI second-layer. If omitted or if the API times out (>5s), the system falls back to deterministic in-browser reasoning automatically — no functionality is lost.

---

## ▶ Running the Application

### Backend

```bash
cd backend
uvicorn app:app --reload
```

API available at: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm run dev
```

Application available at: `http://localhost:8080`

---

## 📡 API Reference

### `GET /`

Health check endpoint.

**Response:**
```json
{ "status": "ok", "message": "TransitFlow AI backend running" }
```

---

### `POST /predict`

Predict transit delay from input features.

**Request Body:**

```json
{
  "temperature_C": 25.0,
  "humidity_percent": 65,
  "wind_speed_kmh": 20,
  "precipitation_mm": 0,
  "traffic_congestion_index": 55,
  "event_attendance_est": 0,
  "holiday": 0,
  "peak_hour": 1,
  "weekday": 4,
  "hour": 8,
  "season": "Summer",
  "weather_condition": "Clear",
  "event_type": "None"
}
```

| Field | Type | Description |
|---|---|---|
| `temperature_C` | float | Ambient temperature in °C |
| `humidity_percent` | int | Relative humidity (0–100) |
| `wind_speed_kmh` | float | Wind speed in km/h |
| `precipitation_mm` | float | Precipitation in mm |
| `traffic_congestion_index` | int | Congestion level 0–100 |
| `event_attendance_est` | int | Estimated event attendees (0 if no event) |
| `holiday` | int | 1 = public holiday, 0 = normal day |
| `peak_hour` | int | 1 = peak hour, 0 = off-peak |
| `weekday` | int | 0 (Sunday) – 6 (Saturday) |
| `hour` | int | Hour of day 0–23 |
| `season` | string | `"Winter"` \| `"Spring"` \| `"Summer"` \| `"Autumn"` |
| `weather_condition` | string | `"Clear"` \| `"Rain"` \| `"Snow"` \| `"Storm"` |
| `event_type` | string | `"None"` \| `"Sports"` \| `"Concert"` \| `"Festival"` |

**Response:**

```json
{
  "predicted_delay": 14.3,
  "factors": [
    { "name": "Peak hour congestion", "impact": "high" },
    { "name": "Rain condition", "impact": "moderate" }
  ]
}
```

---

### `GET /docs`

Interactive Swagger UI documentation for the API.

---

## 🤖 ML Model & Feature Engineering

The backend model is a **`RandomForestRegressor`** trained via scikit-learn and serialized using joblib.

### Feature Engineering Pipeline

Raw inputs undergo the following transformations before being fed to the model:

- **One-hot encoding** for categorical variables: `weather_condition`, `event_type`, `season`
- **Numerical normalization** for continuous variables: temperature, humidity, wind speed, precipitation, congestion index
- **Derived binary flags**: peak hour, holiday, weekday groupings

The feature pipeline is stored in `features.pkl` and applied identically at inference time via the `check_features.py` utilities.

### Model Performance

| Metric | Value |
|---|---|
| Algorithm | RandomForestRegressor |
| Ensemble Size | 100+ decision trees |
| Mean Absolute Error (MAE) | ~8 minutes |
| Response time (backend) | <1 second |

Full training details are in `notebook/model_training.ipynb`.

---

## 🧮 Local Ensemble Model

The local ensemble in `frontend/src/lib/predict.ts` runs entirely in the browser — no server required. It is designed as both a **standalone fallback** and a **blend contributor** (20% weight when the backend is available).

### Component Breakdown

```
Final Delay = calibrationCorrection(
  trafficWeatherInteraction(inputs)
  + temporalDelay(inputs)
  + environmentalStress(inputs)
  + eventDelay(inputs)
  + seasonAdjust(inputs)
)
```

| Component | Key Logic |
|---|---|
| `trafficWeatherInteraction()` | `congestion × weatherMultiplier` — sigmoid wet-road curve amplifies congestion effect under Rain/Snow/Storm |
| `temporalDelay()` | Bimodal Gaussian demand curve peaking at 08:00 and 17:30; weekday multipliers (Mon=1.1, Fri=1.15, Sat=0.7, Sun=0.6); holiday 40% discount |
| `environmentalStress()` | Sigmoid-scaled for: cold (<5°C, steeper below 0°C), heat (>35°C), wind (>45 km/h), humidity (>80%) |
| `eventDelay()` | `log₁₀(attendance) × eventTypeFactor` — Sports=1.2, Concert=1.5, Festival=2.0; saturates above 100,000 attendees |
| `seasonAdjust()` | Winter+1.5, Spring+0.3, Summer+0.0, Autumn+0.8; compound Winter+Snow/Storm penalty +3.0 |
| `calibrationCorrection()` | Residual bias correction for: holiday over-suppression, extreme heat over-prediction, zero-precipitation over-estimation |

### `generateHourlyDelays()`

Produces a 19-point delay forecast from **05:00 to 23:00**, applying the ensemble model at each hour with the hour field overridden — used to power the hourly chart, 3D heatmap, and optimal departure window calculation.

### Blend Mode

```typescript
// When backend responds successfully:
finalDelay = 0.80 × backendDelay + 0.20 × localEnsembleDelay

// When backend is offline or times out:
finalDelay = localEnsembleDelay
```

---

## 🧠 AI Second-Layer (Claude)

After the ML layer produces a baseline, the Claude Haiku model performs a **second-pass reasoning step**.

### What runs deterministically in-browser

All numeric outputs are computed immediately using deterministic formulas — no AI latency:

- **Final adjusted delay** (weather boost, event boost, congestion multiplier, holiday multiplier)
- **90% confidence interval** (based on weather uncertainty, event presence, congestion level)
- **Risk score** (0–100 composite: congestion × 0.35 + weather score + event score + peak hour + delay tier)
- **Risk level** (LOW / MODERATE / HIGH / CRITICAL thresholds at 25 / 50 / 75)
- **Risk breakdown** (5-factor per-category scores with detail strings)
- **Radar chart data** (6-axis: Weather Risk, Traffic Load, Event Pressure, Time Sensitivity, Network Resilience, Recovery Capacity)
- **Optimal departure window** (lowest-delay hour from the 19-point hourly forecast)
- **Recovery time estimate** (first hour post-current where delay drops below 5 min)
- **SLA compliance flags** (auto-triggered at >10 min and >20 min thresholds)

### What Claude generates

A single fast API call fetches text-only intelligence:

- **Executive summary** — 2-sentence operational briefing
- **Operational recommendations** — 3 actionable items for transit operators
- **Cascade effects** — 2 downstream network impact statements

**Timeout handling:** If the Claude API does not respond within 5 seconds, a deterministic text fallback is returned — the platform never blocks or fails.

---

## 📄 Frontend Pages

### `Predict.tsx` — Main Prediction Interface

The core page, split into a **3-column left panel** (form) and **2-column right panel** (results):

**Left Panel (Form Side):**
- Three form fieldsets: Weather, Traffic & Time, Events
- Traffic congestion range slider with live percentage readout
- One-click PREDICT DELAY button with loading states
- **Prediction pipeline tracker** (ML MODEL → AI LAYER → COMPLETE step badges)
- **Live Input Snapshot Panel** — always visible below the tracker, reactive to all form changes

**Right Panel (Results Side):**
- ML Model Output card (baseline delay, key factors)
- AI Enhanced Prediction card (final delay, risk gauge, CI, executive summary, SLA flags)
- 3D Animated Transit Network Map
- Hourly Delay Forecast area chart

**Full-width Analytics Suite** (appears after prediction):
- 3 info cards: Optimal Departure, Recovery Forecast, Route Strategy
- 6-chart grid: Risk Radar, Risk Decomposition, Confidence Envelope, Weather Scenarios, Event Impact, Weekly Variance
- 3D Volumetric Hourly Heatmap
- Operational Recommendations + Cascade Effect Analysis panels

---

### `Home.tsx` — Landing Page

- Hero section with updated badge: "ML ENSEMBLE + AI SECOND-LAYER + 3D VISUALISATION"
- Pipeline badge strip: Ensemble ML Model → Claude AI Layer → 3D Network Map → Full Analytics
- Stats card: MAE ~8min, 24+ features, <3s response, 3 visualisation layers
- Architecture banner showing all 4 pipeline stages
- 6-card features grid (including 3D Transit Map and Live Input Snapshot)
- How It Works: 4-step data flow with ensemble model detail
- Platform Deliverables: 9 output highlights
- CTA section with 6-tile stats grid

---

### `About.tsx` — Architecture & Documentation

- System overview: 3-layer architecture description
- **8-metric performance grid**: MAE, response time, features, decision trees, 3D map, input monitor, charts, blend mode
- **Recently Added Features section**: 4 NEW-badged detailed cards (3D Transit Map, Live Input Snapshot, Improved Ensemble Model, Enhanced 3D Heatmap)
- Prediction pipeline: 5-step flow with UPDATED / AI badges
- AI second-layer capabilities: 4 deep-dive cards
- **3-tier analytics output suite**: Result Cards, 3D Visualisations, Deep Dive Charts
- Tech stack table (10 entries)
- Disclaimer & Notes (8 items including 80/20 blend note and 3D map illustrative note)

---

## 📊 Visualisation Suite

| Visualisation | Type | Description |
|---|---|---|
| **3D Transit Network Map** | Canvas 2D (animated) | Isometric city with animated vehicles, congestion nodes, weather effects |
| **3D Hourly Heatmap** | Canvas 2D (isometric) | Volumetric bars across 19 hours, 5-tier colour coding, NOW marker |
| **Hourly Delay Forecast** | Area chart (Recharts) | 19-hour delay trend with 5-min and 15-min reference lines |
| **Risk Radar** | Radar chart (Recharts) | 6-axis risk profile: Weather, Traffic, Events, Time, Resilience, Recovery |
| **Risk Decomposition** | Horizontal bar (Recharts) | Per-factor AI-assessed scores with detail tooltips |
| **Confidence Envelope** | Composed chart (Recharts) | Shaded 90% CI band overlaid on delay curve |
| **Weather Scenarios** | Bar chart (Recharts) | Delay comparison across Clear / Current / Rain / Storm |
| **Event Impact** | Bar chart (Recharts) | Delay comparison across None / Sports / Concert / Festival |
| **Weekly Variance** | Line chart (Recharts) | Projected delay by day of week |
| **Risk Gauge** | SVG (custom) | Semicircular needle gauge, 0–100 with colour-coded zones |
| **Live Input Snapshot** | React (always-on) | Real-time weather, congestion, env stats, and status chips |

---

## 📦 Dataset

The project uses public transport delay data stored in `dataset/public_transport_delays.csv`.

The dataset includes:
- Historical delay records (minutes) across routes
- Temporal features: hour, weekday, holiday flag, peak hour flag, season
- Environmental conditions: temperature, humidity, wind speed, precipitation, weather type
- Contextual features: traffic congestion index, event type, event attendance estimates
- Route metadata

---

## 🔬 Model Training

The ML model was trained using `notebook/model_training.ipynb`. The training pipeline includes:

1. **Data loading** — ingesting `public_transport_delays.csv`
2. **Exploratory data analysis** — distribution analysis, correlation heatmap, outlier handling
3. **Feature engineering** — one-hot encoding for categorical variables, normalization for numerics, derived features
4. **Train/test split** — held-out test set for unbiased MAE evaluation
5. **Model selection** — RandomForestRegressor vs. alternatives; ensemble selected for robustness
6. **Hyperparameter tuning** — n_estimators, max_depth, min_samples_split optimisation
7. **Model evaluation** — MAE, RMSE, R² on test set; feature importance ranking
8. **Serialization** — model saved as `delay_model.pkl`, feature pipeline as `features.pkl`

---

## ⚙ Configuration

### Backend Environment Variables

```env
MODEL_PATH=./delay_model.pkl
FEATURES_PATH=./features.pkl
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:8000        # Backend base URL
VITE_ANTHROPIC_API_KEY=sk-ant-...         # Claude Haiku API key (optional)
```

### CORS

The FastAPI backend is configured to allow requests from the Vite dev server (`http://localhost:8080`) and production origins. Update `origins` in `app.py` as needed for your deployment.

---

## 🚢 Deployment

### Build the Frontend

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Run Backend in Production

```bash
cd backend
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker

```bash
# Build
docker build -t transitflow-ai .

# Run
docker run -p 8000:8000 -p 8080:80 transitflow-ai
```

A `docker-compose.yml` can be used to orchestrate both services:

```yaml
version: "3.9"
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file: ./backend/.env

  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    env_file: ./frontend/.env
    depends_on:
      - backend
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes, following existing code style
4. Add or update tests where applicable (`frontend/src/test/`)
5. Run the frontend type-check: `cd frontend && npm run typecheck`
6. Submit a pull request with a clear description of changes

---

## 📜 License

This project is licensed under the **MIT License** — see the `LICENSE` file for details.

---

## 💬 Support

- Create an issue in the repository for bugs or feature requests
- Review the interactive API documentation at `http://localhost:8000/docs`

---

## 👤 Author

Developed by **Pranav V P**

---

*TransitFlow AI — Predicting delays so operators can act before passengers notice.*
