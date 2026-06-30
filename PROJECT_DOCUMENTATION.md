# 🌾 AgriSense: Smart Weather Advisory & Crop Forecasting System
## Comprehensive Project Documentation & Technical Specification

Welcome to the official documentation for **AgriSense**, a full-fledged simulation-based demo project illustrating the integration of Big Data, meteorological simulations, and simulated Convolutional Neural Networks (CNN) for modern precision agriculture.

This document describes the design, architecture, database schemas, machine learning engine, API specifications, and frontend design guidelines of the application.

---

## 1. Executive Summary & Core Design Philosophy

Modern agriculture is highly vulnerable to climate change and volatile weather patterns. **AgriSense** acts as a decision support system for farmers by:
- Monitoring micro-local weather parameters (temperature, humidity, wind speed, rainfall, and soil moisture).
- Leveraging a simulated **1D-CNN (Convolutional Neural Network)** to estimate crop yields in real time.
- Providing condition-based **Smart Advisories** to optimize fertilizer, sowing, harvesting, and irrigation activities.
- Visualizing regional crop health patterns using interactive multi-dimensional analytics.

The system is designed with a **minimalistic, single-folder structure** (6 main files), using a fast, non-relational **JSON Database** and written in a lightweight backend stack without heavy Python/PyTorch dependencies to guarantee ease of deployment and instant evaluation.

---

## 2. Technology Stack & Design Aesthetics

| Layer | Component | Description / Technology |
|---|---|---|
| **Core Backend** | Runtime | Node.js (Version 16+) |
| **API Framework** | Server | Express.js (Single `server.js` orchestrator) |
| **Database** | storage | JSON files (`db/weather.json`, `db/crops.json`, `db/advisories.json`) |
| **ML Engine** | Intelligence | Pure JavaScript Math Engine (1D-CNN, custom Normalization, Sigmoid) |
| **Core Frontend** | Client | HTML5 + CSS3 + Vanilla ES6 JavaScript (Single `public/index.html`) |
| **Data Viz** | Charting | Chart.js 4.4.0 (CDN-delivered for Line, Bar, and Radar charts) |
| **Styling System** | UI Theme | Premium Dark Mode + Glassmorphism (`rgba` backdrops, backdrop-filter blur, CSS custom variables) |
| **Deployment** | Scripting | Windows Batch Script (`run.bat` auto-setup and start) |

### Design Theme: Dark Glassmorphism
- **Color Palette:** Deep navy background (`#070b14`), dark-slate cards (`rgba(15, 23, 42, 0.65)`), accents in Teal (`#06d6a0`), Blue (`#4361ee`), Purple (`#7b2ff7`), Warm Orange (`#fb8500`), and Coral Red (`#ef476f`).
- **Typography:** Google Fonts: *Inter* (weights 300 to 800) with letter-spacing improvements.
- **Responsive Layout:** Responsive Flexbox/Grid structures, sliding mobile nav on screens ≤ 900px, and CSS keyframe animations (`fadeIn`, `pulse`, `float`).

---

## 3. System Architecture & Data Flow

The following visual diagram depicts the request-response cycle and internal processing pipeline of AgriSense:

```
                  ┌──────────────────────────────────────────────┐
                  │                 USER BROWSER                 │
                  │   ┌──────────────────────────────────────┐   │
                  │   │   Glassmorphism UI (index.html)      │   │
                  │   ├──────────────────┬───────────────────┤   │
                  │   │  Stats Widgets   │ Interactive Charts│   │
                  │   └────────┬─────────┴─────────▲─────────┘   │
                  └────────────│───────────────────│─────────────┘
                               │ POST /api/predict │ JSON Data
                               │ GET  /api/weather │
                               ▼                   │
                  ┌────────────────────────────────┴─────────────┐
                  │             EXPRESS BACKEND SERVER           │
                  │                   (server.js)                │
                  │  ┌────────────────────────────────────────┐  │
                  │  │              API Handlers              │  │
                  │  └──────────────────┬─────────────────────┘  │
                  │                     │                        │
                  │    ┌────────────────┼────────────────┐       │
                  │    ▼                ▼                ▼       │
                  │ ┌──────┐      ┌───────────┐     ┌─────────┐  │
                  │ │Weather│     │ 1D-CNN    │     │Advisory │  │
                  │ │Sim.  │     │ ML Engine │     │Generator│  │
                  │ └─┬────┘      └─────┬─────┘     └────┬────┘  │
                  └───┼─────────────────┼────────────────┼───────┘
                      ▼                 ▼                ▼
                  ┌──────────────────────────────────────────────┐
                  │              JSON DATA STORE                 │
                  │   ┌──────────────┬─────────────┬──────────┐  │
                  │   │ weather.json │  crops.json │ adv.json │  │
                  │   └──────────────┴─────────────┴──────────┘  │
                  └──────────────────────────────────────────────┘
```

1. **Weather Simulation Pipeline:** On request, `server.js` fetches the active city profile, adds diurnal and time-varying sinusoidal noise, and generates standard current weather metrics.
2. **CNN Yield Prediction Pipeline:** The user selects a crop. The frontend sends a `POST` request to `/api/predict`. The backend normalizes the parameters, runs the 1D convolution layer, applies ReLU activation, performs Max Pooling, feeds the outputs to a Dense layer, computes the sigmoid probability score, and projects it into the crop's yield range.
3. **Advisory Pipeline:** The current weather metrics are compared against active advisory triggers, generating categorized, priority-ordered instructions for the farmer.

---

## 4. Location Database & Climate Profiles

AgriSense includes a multi-region location database of **40+ Indian cities across 12 states**. Instead of uniform simulated weather, each city is categorized into one of **6 distinct climate zones** that modify the base variables:

| Climate Category | Temperature Range | Humidity Range | Rainfall Pattern | Typical Locations |
|---|---|---|---|---|
| **Tropical Coastal** | Warm (31°C - 35°C) | High (72% - 80%) | Moderate to High | Nellore, Chennai, Surat |
| **Tropical Humid** | High (33°C - 36°C) | Medium-High (68% - 78%) | Moderate monsoon | Vijayawada, Guntur, Kolkata, Bhubaneswar |
| **Semi-Arid** | High (30°C - 38°C) | Low-Medium (48% - 60%) | Sparse/Infrequent | Kurnool, Hyderabad, Indore, Nagpur |
| **Tropical Moderate**| Mild (28°C - 32°C) | Medium (55% - 65%) | Light to Moderate | Bengaluru, Pune, Mysuru |
| **Subtropical** | Variable (30°C - 36°C) | Medium-High (55% - 82%) | Seasonal monsoon | Lucknow, Patna, Amritsar, Siliguri |
| **Arid (Desert)** | Extreme (38°C - 42°C) | Low (30% - 45%) | Low / Negligible | Jodhpur, Jaipur, Ahmedabad |

---

## 5. Simulated CNN (Convolutional Neural Network) Model

To demonstrate ML pipelines cleanly, AgriSense implements a **1D Convolutional Neural Network** from scratch in pure JS (`server.js`).

### Input Features & Normalization
The input vector $X$ consists of 5 weather variables:
$$X = [\text{temperature}, \text{humidity}, \text{rainfall}, \text{wind\_speed}, \text{soil\_moisture}]$$

Before processing, each feature is normalized to a $[0, 1]$ range:
$$\hat{x} = \frac{x - x_{\text{min}}}{x_{\text{max}} - x_{\text{min}}}$$

| Feature ($x$) | Normalization Min ($x_{\text{min}}$) | Normalization Max ($x_{\text{max}}$) |
|---|---|---|
| Temperature | 0°C | 50°C |
| Humidity | 0% | 100% |
| Rainfall | 0 mm | 300 mm |
| Wind Speed | 0 km/h | 50 km/h |
| Soil Moisture | 0% | 100% |

### CNN Layers Pipeline

#### Layer 1: 1D Convolution
The input vector $\hat{X}$ of length 5 is convolved with a 1D kernel $W_{\text{kernel}}$ of size 3 (stride = 1, padding = 0) and a convolution bias $b_{\text{conv}}$:
$$z_{\text{conv}}[i] = b_{\text{conv}} + \sum_{j=0}^{2} \hat{X}[i+j] \cdot W_{\text{kernel}}[j] \quad \text{for } i \in [0, 1, 2]$$
- Input Size: $1 \times 5$
- Output Size: $1 \times 3$

#### Layer 2: Rectified Linear Unit (ReLU) Activation
An element-wise activation to introduce non-linearity:
$$z_{\text{relu}}[i] = \max(0, z_{\text{conv}}[i]) \quad \text{for } i \in [0, 1, 2]$$

#### Layer 3: 1D Max Pooling
A pooling window of size 2 (stride = 1) is passed across the ReLU output to capture the most prominent features:
$$z_{\text{pool}}[k] = \max(z_{\text{relu}}[k], z_{\text{relu}}[k+1]) \quad \text{for } k \in [0, 1]$$
- Output Size: $1 \times 2$

#### Layer 4: Dense (Fully Connected) Layer
The pooled vector is flattened and connected to a single neuron with dense weights $W_{\text{dense}}$ and bias $b_{\text{dense}}$:
$$z_{\text{dense}} = b_{\text{dense}} + \sum_{k=0}^{1} z_{\text{pool}}[k] \cdot W_{\text{dense}}[k]$$

#### Layer 5: Sigmoid Activation
Produces a score $S \in [0, 1]$ representing the overall growth quality score:
$$S = \sigma(z_{\text{dense}}) = \frac{1}{1 + e^{-z_{\text{dense}}}}$$

### Yield Scaling
The final predicted yield is scaled between the crop's minimum and maximum thresholds:
$$\text{Yield}_{\text{predicted}} = \text{Yield}_{\text{min}} + S \cdot (\text{Yield}_{\text{max}} - \text{Yield}_{\text{min}})$$

### Confidence and Risk Calculation
- **Confidence Rating:** A fitness algorithm calculates how close the weather inputs are to the crop's optimal limits. If all parameters match, confidence is high (~95%). For every out-of-bounds parameter, a penalty is applied.
- **Risk Assessment:** Analyzes individual triggers (e.g. Temp > Crop Max Temp + 5°C leads to `"Extreme heat stress"`). If multiple stress flags are active, risk climbs through `low`, `moderate`, `high`, up to `critical`.

---

## 6. Detailed API Reference

The Express server exposes the following 8 endpoints:

### 1. `GET /api/locations`
Fetches all supported locations grouped by state and indicates the active location.
- **Response Format:**
```json
{
  "success": true,
  "data": {
    "states": ["Andhra Pradesh", "Telangana", "Rajasthan"],
    "locations": {
      "Andhra Pradesh": [
        { "id": "nellore", "city": "Nellore", "climate": "tropical_coastal" }
      ]
    },
    "selected": "nellore"
  }
}
```

### 2. `POST /api/location/select`
Switches the active simulated location context.
- **Request Body:**
```json
{
  "location_id": "jodhpur"
}
```
- **Response Format:**
```json
{
  "success": true,
  "data": {
    "id": "jodhpur",
    "city": "Jodhpur",
    "state": "Rajasthan",
    "lat": 26.24,
    "lon": 73.02
  }
}
```

### 3. `GET /api/weather/current`
Returns current simulated weather for the active location.
- **Response Format:**
```json
{
  "success": true,
  "data": {
    "location": { "name": "Nellore, Andhra Pradesh", "lat": 14.44, "lon": 79.99, "elevation": 20 },
    "current": {
      "temperature": 32.4,
      "feels_like": 35.8,
      "humidity": 74,
      "rainfall": 15.2,
      "wind_speed": 14.5,
      "wind_direction": "SW",
      "soil_moisture": 56,
      "pressure": 1011,
      "uv_index": 8,
      "visibility": 7,
      "condition": "Light Rain",
      "condition_code": "light_rain",
      "last_updated": "2026-06-30T17:20:00.000Z"
    }
  }
}
```

### 4. `GET /api/weather/forecast`
Returns the generated 7-day weather forecast based on the active location's climate metrics.

### 5. `GET /api/weather/history`
Returns 30 days of historical weather logs (used to generate charts on the dashboard).

### 6. `GET /api/alerts`
Returns current active weather alerts (e.g. heavy rain warnings, flood watches).

### 7. `GET /api/crops`
Fetches all configured crop profiles, including their optimal growing condition parameters.

### 8. `POST /api/predict`
Executes the CNN forward-pass simulation to predict crop yield.
- **Request Body:**
```json
{
  "crop_id": "rice",
  "weather_override": null
}
```
- **Response Format:**
```json
{
  "success": true,
  "data": {
    "crop": "Rice",
    "predicted_yield": 6.34,
    "yield_unit": "tons/hectare",
    "confidence": 92.5,
    "risk_level": "low",
    "risk_factors": ["No significant risk factors detected"],
    "score": 0.7679,
    "cnn_trace": {
      "input_raw": { "temperature": 31.3, "humidity": 70, "rainfall": 12.5, "wind_speed": 12.9, "soil_moisture": 57 },
      "input_normalized": [0.626, 0.7, 0.0416, 0.258, 0.57],
      "conv1d_output": [0.9043, 0.5527, 0.7336],
      "relu_output": [0.9043, 0.5527, 0.7336],
      "maxpool_output": [0.9043, 0.7336],
      "dense_output": 1.1966,
      "sigmoid_score": 0.7679
    },
    "weather_used": { "temperature": 31.3, "humidity": 70, "rainfall": 12.5, "wind_speed": 12.9, "soil_moisture": 57 },
    "model_info": {
      "type": "Simulated 1D-CNN",
      "architecture": "Input(5) → Conv1D(k=3) → ReLU → MaxPool(2) → Dense(1) → Sigmoid",
      "parameters": 12
    }
  }
}
```

---

## 7. Database Schemas

### 1. `db/crops.json` (Snippet)
Contains crop definitions and preset CNN layer weights.
```json
{
  "crops": [
    {
      "id": "rice",
      "name": "Rice",
      "emoji": "🌾",
      "category": "Cereal",
      "season": "Kharif",
      "sowing_months": ["June", "July"],
      "harvest_months": ["October", "November"],
      "growth_duration_days": 120,
      "water_requirement": "High",
      "description": "Staple food crop requiring warm temperatures and abundant water.",
      "optimal": {
        "temp_min": 20, "temp_max": 37,
        "humidity_min": 60, "humidity_max": 95,
        "rainfall_min": 100, "rainfall_max": 300,
        "wind_max": 30,
        "soil_moisture_min": 50, "soil_moisture_max": 90
      },
      "yield_range": { "min": 2.5, "max": 7.5, "unit": "tons/hectare" },
      "cnn_weights": {
        "kernel": [0.35, 0.82, 0.75],
        "conv_bias": 0.08,
        "dense_weights": [0.72, 0.58],
        "dense_bias": 0.12
      }
    }
  ]
}
```

### 2. `db/advisories.json` (Snippet)
Stores logical templates checked during the weather assessment run.
```json
{
  "templates": [
    {
      "id": "adv_irr_001",
      "category": "irrigation",
      "icon": "💧",
      "title": "Reduce Irrigation — Rain Expected",
      "message": "Heavy rainfall is forecasted in the next 48 hours. Reduce or stop irrigation to prevent waterlogging.",
      "priority": "warning",
      "conditions": { "rainfall_above": 30, "soil_moisture_above": 50 }
    }
  ]
}
```

---

## 8. Sowing, Harvesting & Schedulers Setup

If deploying this system in an actual field environment:
1. **IoT Integration:** Replace `simulateCurrentWeather()` inside `server.js` with physical sensor calls (e.g. DHT22 for temp/humidity, capacitive soil probe, anemometer).
2. **Batch scheduler / Cron:** Set up a cron task or utilize the Windows Task Scheduler to run the prediction daily:
   ```bash
   # Linux cron job to fetch predictions and mail advisories every morning at 6:00 AM
   0 6 * * * curl -s http://localhost:3000/api/predict/all > /var/log/agrisense_daily.json
   ```

---

## 9. Setup & Running Instructions

Ensure Node.js is installed on your computer.

1. Navigate to the Desktop project folder:
   ```bash
   cd C:\Users\sak78\Desktop\smart-weather-crop
   ```
2. Simply double-click on `run.bat` or run:
   ```bash
   run.bat
   ```
3. The batch file will:
   - Check if `node_modules` exists; if not, it automatically runs `npm install`.
   - Start the Express server on `http://localhost:3000`.
   - Open your default browser to the application page.
