# 🌾 AgriSense — Smart Weather Advisory & Crop Forecasting System

> AI-powered weather monitoring and CNN-based crop yield prediction platform for modern agriculture.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [CNN Model Details](#cnn-model-details)
- [API Documentation](#api-documentation)
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)

---

## Overview

**AgriSense** is a full-stack demo application that simulates an AI-powered agricultural intelligence platform. It combines real-time weather simulation with a Convolutional Neural Network (CNN) engine to provide:

- Live weather monitoring with alerts
- 7-day weather forecasting
- CNN-based crop yield predictions for 6 major crops
- Smart farming advisories based on current conditions
- Historical data analytics with interactive charts

This is a **simulation-based demo** — the CNN runs entirely in JavaScript with pre-trained weights, requiring no GPU, Python, or external ML libraries.

---

## Features

### 🌦️ Weather Dashboard
- Real-time simulated weather with temperature, humidity, wind, rainfall, and soil moisture
- Time-based micro-variations for a "live" feel
- Severe weather alerts (heavy rain warnings, flood watches)

### 🌤️ 7-Day Forecast
- Dynamically generated forecast based on historical trends
- Monsoon pattern simulation with wet/dry spell alternation
- Interactive temperature and rainfall trend charts

### 🌾 Crop Yield Prediction
- **6 crops supported**: Rice, Wheat, Corn, Sugarcane, Cotton, Soybean
- CNN-based yield prediction with:
  - Predicted yield (tons/hectare)
  - Confidence score (0-100%)
  - Risk level assessment (low/moderate/high/critical)
  - Full CNN pipeline trace (layer-by-layer output visualization)
- Season-aware predictions with optimal condition matching

### 📋 Smart Advisories
- 13 advisory templates across 6 categories
- Condition-based triggering (weather-sensitive)
- Priority levels: Critical, Warning, Info
- Categories: Irrigation, Pest Control, Sowing, Harvesting, Weather Alerts, Soil Management, Fertilizer

### 📈 Analytics
- 30-day historical weather trends (multi-line chart)
- Crop yield comparison (bar chart)
- Confidence & CNN score radar chart

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│         (Single HTML + CSS + JS)             │
│  ┌─────────┬──────────┬─────────┬─────────┐ │
│  │Dashboard│ Forecast │  Crops  │Analytics│ │
│  └────┬────┴────┬─────┴────┬────┴────┬────┘ │
│       │         │          │         │       │
│       └─────────┴────┬─────┴─────────┘       │
│                      │ fetch()               │
└──────────────────────┼───────────────────────┘
                       │ HTTP/JSON
┌──────────────────────┼───────────────────────┐
│               Express Server                  │
│  ┌───────────────────┼───────────────────┐   │
│  │            API Routes                 │   │
│  │  /weather  /crops  /predict  /advise  │   │
│  └───────────────────┼───────────────────┘   │
│                      │                       │
│  ┌──────────┐  ┌─────┴──────┐  ┌─────────┐ │
│  │ Weather  │  │ CNN Engine │  │Advisory │  │
│  │Simulator │  │ (Pure JS)  │  │Generator│  │
│  └────┬─────┘  └─────┬──────┘  └────┬────┘ │
│       │              │              │        │
│  ┌────┴──────────────┴──────────────┴────┐  │
│  │           JSON Database               │  │
│  │  weather.json  crops.json  advise.json│  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## CNN Model Details

### Architecture

The system implements a simplified **1D Convolutional Neural Network** in pure JavaScript:

```
Input Layer (5 features)
    │
    ▼
┌─────────────────────────┐
│  1D Convolution          │  kernel_size=3, stride=1
│  Output: 3 values        │  weights: 3 kernel + 1 bias = 4 params
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  ReLU Activation         │  max(0, x)
│  Output: 3 values        │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  Max Pooling             │  pool_size=2, stride=1
│  Output: 2 values        │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  Dense Layer             │  2 weights + 1 bias = 3 params
│  Output: 1 value         │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  Sigmoid Activation      │  1/(1+e^(-x))
│  Output: score [0, 1]    │
└─────────┬───────────────┘
          │
          ▼
    Yield = min + score × (max - min)
```

**Total Parameters: 8 per crop × 6 crops = 48**

### Input Features

| Feature | Range | Normalization |
|---------|-------|---------------|
| Temperature (°C) | 0–50 | `(val - 0) / 50` |
| Humidity (%) | 0–100 | `(val - 0) / 100` |
| Rainfall (mm) | 0–300 | `(val - 0) / 300` |
| Wind Speed (km/h) | 0–50 | `(val - 0) / 50` |
| Soil Moisture (%) | 0–100 | `(val - 0) / 100` |

### Confidence Calculation

Confidence is calculated independently of the CNN by measuring how close current weather conditions are to the crop's optimal growing parameters:

```
confidence = average(temp_fitness, humidity_fitness, soil_fitness, wind_fitness) × 100
```

Each fitness score ranges from 0 to 1 based on distance from optimal range.

### Risk Assessment

Risk factors are generated based on threshold analysis:
- **Low**: Confidence ≥ 80% and no risk factors
- **Moderate**: Confidence ≥ 60% and ≤ 1 risk factor
- **High**: Confidence ≥ 40%
- **Critical**: Confidence < 40%

---

## API Documentation

### `GET /api/weather/current`
Returns current simulated weather with time-based variations.

**Response:**
```json
{
  "success": true,
  "data": {
    "location": { "name": "Indore, Madhya Pradesh", "lat": 22.72, "lon": 75.86 },
    "current": {
      "temperature": 32.4,
      "humidity": 72,
      "rainfall": 12.5,
      "wind_speed": 14.2,
      "soil_moisture": 58,
      "condition": "Partly Cloudy"
    }
  }
}
```

### `GET /api/weather/forecast`
Returns 7-day weather forecast.

### `GET /api/weather/history`
Returns 30 days of historical weather data.

### `GET /api/alerts`
Returns active weather alerts.

### `GET /api/crops`
Returns profiles for all 6 supported crops.

### `POST /api/predict`
Runs CNN prediction for a specific crop.

**Request:**
```json
{
  "crop_id": "rice",
  "weather_override": {
    "temperature": 32,
    "humidity": 75,
    "rainfall": 20,
    "wind_speed": 12,
    "soil_moisture": 60
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "crop": "Rice",
    "predicted_yield": 5.82,
    "yield_unit": "tons/hectare",
    "confidence": 87.3,
    "risk_level": "low",
    "risk_factors": ["No significant risk factors detected"],
    "score": 0.6643,
    "cnn_trace": {
      "input_normalized": [0.64, 0.75, 0.067, 0.24, 0.60],
      "conv1d_output": [1.003, 0.612, 0.558],
      "relu_output": [1.003, 0.612, 0.558],
      "maxpool_output": [1.003, 0.612],
      "dense_output": 0.978,
      "sigmoid_score": 0.6643
    }
  }
}
```

### `GET /api/predict/all`
Returns CNN predictions for all 6 crops simultaneously.

### `GET /api/advisories`
Returns smart farming advisories based on current conditions.

---

## Setup & Installation

### Prerequisites
- **Node.js** 16+ (recommended: 18+)
- **npm** (comes with Node.js)

### Quick Start

```bash
# 1. Navigate to the project directory
cd smart-weather-crop

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open in browser
# Visit http://localhost:3000
```

The server will display:
```
  ╔══════════════════════════════════════════════╗
  ║   🌾 AgriSense — Smart Crop Forecasting     ║
  ║   Server running on http://localhost:3000    ║
  ╚══════════════════════════════════════════════╝
```

---

## Project Structure

```
smart-weather-crop/
├── server.js            # Express backend + CNN engine + API routes
├── package.json         # Node.js project configuration
├── README.md            # This documentation
├── db/
│   ├── weather.json     # 30-day weather history + current state + alerts
│   ├── crops.json       # 6 crop profiles + CNN weights
│   └── advisories.json  # 13 advisory templates with conditions
└── public/
    └── index.html       # Complete frontend (HTML + CSS + JS)
```

**Total: 6 files** — intentionally minimal.

---

## Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Server | Node.js + Express 4 | REST API, static serving |
| Frontend | Vanilla HTML/CSS/JS | Single-file UI with glassmorphism |
| Charts | Chart.js 4 (CDN) | Line, bar, radar charts |
| Fonts | Inter (Google Fonts) | Modern typography |
| Database | JSON files | Weather, crops, advisories |
| ML Engine | Pure JavaScript | Simulated CNN (Conv1D + ReLU + Pool + Dense) |

---

## Supported Crops

| Crop | Season | Water Need | Yield Range |
|------|--------|-----------|-------------|
| 🌾 Rice | Kharif | High | 2.5–7.5 t/ha |
| 🌿 Wheat | Rabi | Medium | 2.0–6.0 t/ha |
| 🌽 Corn | Kharif | Medium-High | 3.0–9.0 t/ha |
| 🎋 Sugarcane | Annual | Very High | 40–100 t/ha |
| ☁️ Cotton | Kharif | Medium | 1.0–3.5 t/ha |
| 🫘 Soybean | Kharif | Medium | 1.0–3.5 t/ha |

---

## License

MIT License — Free for educational and demo purposes.
