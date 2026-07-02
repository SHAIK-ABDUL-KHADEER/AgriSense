// ============================================================
//  AgriSense — Smart Weather Advisory & Crop Forecasting Server
//  Backend with Simulated CNN Engine
// ============================================================

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Load JSON Databases ──────────────────────────────────────
const weatherData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'weather.json'), 'utf8'));
const cropsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'crops.json'), 'utf8'));
const advisoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'advisories.json'), 'utf8'));

// ══════════════════════════════════════════════════════════════
//  LOCATIONS DATABASE (Indian States & Cities)
// ══════════════════════════════════════════════════════════════

const locations = [
  // Andhra Pradesh
  { id: 'nellore',      city: 'Nellore',      state: 'Andhra Pradesh',  lat: 14.44, lon: 79.99, elevation: 20,  climate: 'tropical_coastal',  base_temp: 33, base_humidity: 72, base_rainfall: 15, base_wind: 14, base_soil: 55 },
  { id: 'vijayawada',   city: 'Vijayawada',   state: 'Andhra Pradesh',  lat: 16.51, lon: 80.65, elevation: 12,  climate: 'tropical_humid',    base_temp: 34, base_humidity: 70, base_rainfall: 12, base_wind: 12, base_soil: 52 },
  { id: 'guntur',       city: 'Guntur',       state: 'Andhra Pradesh',  lat: 16.31, lon: 80.44, elevation: 30,  climate: 'tropical_humid',    base_temp: 35, base_humidity: 68, base_rainfall: 10, base_wind: 11, base_soil: 48 },
  { id: 'kurnool',      city: 'Kurnool',      state: 'Andhra Pradesh',  lat: 15.83, lon: 78.04, elevation: 281, climate: 'semi_arid',         base_temp: 37, base_humidity: 50, base_rainfall: 5,  base_wind: 10, base_soil: 32 },
  { id: 'tirupati',     city: 'Tirupati',     state: 'Andhra Pradesh',  lat: 13.63, lon: 79.42, elevation: 160, climate: 'tropical_humid',    base_temp: 34, base_humidity: 65, base_rainfall: 8,  base_wind: 10, base_soil: 45 },
  // Telangana
  { id: 'hyderabad',    city: 'Hyderabad',    state: 'Telangana',       lat: 17.39, lon: 78.49, elevation: 542, climate: 'semi_arid',         base_temp: 35, base_humidity: 55, base_rainfall: 8,  base_wind: 12, base_soil: 38 },
  { id: 'warangal',     city: 'Warangal',     state: 'Telangana',       lat: 17.98, lon: 79.60, elevation: 302, climate: 'semi_arid',         base_temp: 34, base_humidity: 58, base_rainfall: 10, base_wind: 10, base_soil: 40 },
  { id: 'nizamabad',    city: 'Nizamabad',    state: 'Telangana',       lat: 18.67, lon: 78.09, elevation: 396, climate: 'semi_arid',         base_temp: 33, base_humidity: 55, base_rainfall: 12, base_wind: 9,  base_soil: 42 },
  // Tamil Nadu
  { id: 'chennai',      city: 'Chennai',      state: 'Tamil Nadu',      lat: 13.08, lon: 80.27, elevation: 6,   climate: 'tropical_coastal',  base_temp: 35, base_humidity: 75, base_rainfall: 5,  base_wind: 16, base_soil: 40 },
  { id: 'coimbatore',   city: 'Coimbatore',   state: 'Tamil Nadu',      lat: 11.01, lon: 76.96, elevation: 411, climate: 'semi_arid',         base_temp: 31, base_humidity: 60, base_rainfall: 6,  base_wind: 12, base_soil: 38 },
  { id: 'madurai',      city: 'Madurai',      state: 'Tamil Nadu',      lat: 9.93,  lon: 78.12, elevation: 101, climate: 'semi_arid',         base_temp: 36, base_humidity: 58, base_rainfall: 4,  base_wind: 10, base_soil: 35 },
  { id: 'thanjavur',    city: 'Thanjavur',    state: 'Tamil Nadu',      lat: 10.79, lon: 79.14, elevation: 57,  climate: 'tropical_humid',    base_temp: 34, base_humidity: 72, base_rainfall: 8,  base_wind: 10, base_soil: 55 },
  // Karnataka
  { id: 'bangalore',    city: 'Bengaluru',    state: 'Karnataka',       lat: 12.97, lon: 77.59, elevation: 920, climate: 'tropical_moderate', base_temp: 28, base_humidity: 65, base_rainfall: 10, base_wind: 12, base_soil: 45 },
  { id: 'mysore',       city: 'Mysuru',       state: 'Karnataka',       lat: 12.30, lon: 76.66, elevation: 770, climate: 'tropical_moderate', base_temp: 29, base_humidity: 62, base_rainfall: 8,  base_wind: 10, base_soil: 42 },
  { id: 'hubli',        city: 'Hubli',        state: 'Karnataka',       lat: 15.36, lon: 75.12, elevation: 640, climate: 'semi_arid',         base_temp: 30, base_humidity: 60, base_rainfall: 12, base_wind: 14, base_soil: 40 },
  { id: 'bellary',      city: 'Bellary',      state: 'Karnataka',       lat: 15.15, lon: 76.93, elevation: 449, climate: 'semi_arid',         base_temp: 35, base_humidity: 48, base_rainfall: 5,  base_wind: 12, base_soil: 30 },
  // Maharashtra
  { id: 'pune',         city: 'Pune',         state: 'Maharashtra',     lat: 18.52, lon: 73.86, elevation: 560, climate: 'tropical_moderate', base_temp: 30, base_humidity: 62, base_rainfall: 15, base_wind: 14, base_soil: 48 },
  { id: 'nagpur',       city: 'Nagpur',       state: 'Maharashtra',     lat: 21.15, lon: 79.09, elevation: 310, climate: 'semi_arid',         base_temp: 38, base_humidity: 50, base_rainfall: 8,  base_wind: 10, base_soil: 35 },
  { id: 'nashik',       city: 'Nashik',       state: 'Maharashtra',     lat: 20.00, lon: 73.78, elevation: 584, climate: 'tropical_moderate', base_temp: 32, base_humidity: 55, base_rainfall: 12, base_wind: 10, base_soil: 42 },
  { id: 'aurangabad',   city: 'Aurangabad',   state: 'Maharashtra',     lat: 19.88, lon: 75.34, elevation: 568, climate: 'semi_arid',         base_temp: 35, base_humidity: 48, base_rainfall: 6,  base_wind: 12, base_soil: 32 },
  // Madhya Pradesh
  { id: 'indore',       city: 'Indore',       state: 'Madhya Pradesh',  lat: 22.72, lon: 75.86, elevation: 553, climate: 'semi_arid',         base_temp: 34, base_humidity: 55, base_rainfall: 10, base_wind: 12, base_soil: 40 },
  { id: 'bhopal',       city: 'Bhopal',       state: 'Madhya Pradesh',  lat: 23.26, lon: 77.41, elevation: 527, climate: 'semi_arid',         base_temp: 33, base_humidity: 58, base_rainfall: 12, base_wind: 10, base_soil: 42 },
  { id: 'jabalpur',     city: 'Jabalpur',     state: 'Madhya Pradesh',  lat: 23.18, lon: 79.95, elevation: 412, climate: 'tropical_humid',    base_temp: 34, base_humidity: 62, base_rainfall: 15, base_wind: 8,  base_soil: 48 },
  // Uttar Pradesh
  { id: 'lucknow',      city: 'Lucknow',      state: 'Uttar Pradesh',   lat: 26.85, lon: 80.95, elevation: 123, climate: 'subtropical',       base_temp: 35, base_humidity: 65, base_rainfall: 10, base_wind: 10, base_soil: 45 },
  { id: 'varanasi',     city: 'Varanasi',     state: 'Uttar Pradesh',   lat: 25.32, lon: 83.01, elevation: 80,  climate: 'subtropical',       base_temp: 36, base_humidity: 68, base_rainfall: 12, base_wind: 12, base_soil: 48 },
  { id: 'kanpur',       city: 'Kanpur',       state: 'Uttar Pradesh',   lat: 26.45, lon: 80.33, elevation: 126, climate: 'subtropical',       base_temp: 36, base_humidity: 60, base_rainfall: 8,  base_wind: 10, base_soil: 40 },
  // Punjab
  { id: 'amritsar',     city: 'Amritsar',     state: 'Punjab',          lat: 31.63, lon: 74.87, elevation: 234, climate: 'subtropical',       base_temp: 34, base_humidity: 55, base_rainfall: 8,  base_wind: 12, base_soil: 42 },
  { id: 'ludhiana',     city: 'Ludhiana',     state: 'Punjab',          lat: 30.90, lon: 75.86, elevation: 244, climate: 'subtropical',       base_temp: 35, base_humidity: 58, base_rainfall: 10, base_wind: 10, base_soil: 45 },
  { id: 'patiala',      city: 'Patiala',      state: 'Punjab',          lat: 30.34, lon: 76.39, elevation: 250, climate: 'subtropical',       base_temp: 34, base_humidity: 55, base_rainfall: 8,  base_wind: 10, base_soil: 40 },
  // Rajasthan
  { id: 'jaipur',       city: 'Jaipur',       state: 'Rajasthan',       lat: 26.91, lon: 75.79, elevation: 431, climate: 'arid',              base_temp: 38, base_humidity: 35, base_rainfall: 3,  base_wind: 15, base_soil: 22 },
  { id: 'jodhpur',      city: 'Jodhpur',      state: 'Rajasthan',       lat: 26.24, lon: 73.02, elevation: 231, climate: 'arid',              base_temp: 40, base_humidity: 30, base_rainfall: 1,  base_wind: 18, base_soil: 18 },
  { id: 'udaipur',      city: 'Udaipur',      state: 'Rajasthan',       lat: 24.59, lon: 73.71, elevation: 598, climate: 'semi_arid',         base_temp: 34, base_humidity: 45, base_rainfall: 8,  base_wind: 10, base_soil: 30 },
  // Gujarat
  { id: 'ahmedabad',    city: 'Ahmedabad',    state: 'Gujarat',         lat: 23.02, lon: 72.57, elevation: 53,  climate: 'arid',              base_temp: 38, base_humidity: 42, base_rainfall: 4,  base_wind: 14, base_soil: 25 },
  { id: 'surat',        city: 'Surat',        state: 'Gujarat',         lat: 21.17, lon: 72.83, elevation: 13,  climate: 'tropical_coastal',  base_temp: 33, base_humidity: 72, base_rainfall: 15, base_wind: 16, base_soil: 50 },
  { id: 'rajkot',       city: 'Rajkot',       state: 'Gujarat',         lat: 22.30, lon: 70.80, elevation: 128, climate: 'semi_arid',         base_temp: 36, base_humidity: 48, base_rainfall: 5,  base_wind: 14, base_soil: 28 },
  // West Bengal
  { id: 'kolkata',      city: 'Kolkata',      state: 'West Bengal',     lat: 22.57, lon: 88.36, elevation: 9,   climate: 'tropical_humid',    base_temp: 33, base_humidity: 80, base_rainfall: 20, base_wind: 12, base_soil: 62 },
  { id: 'siliguri',     city: 'Siliguri',     state: 'West Bengal',     lat: 26.71, lon: 88.43, elevation: 122, climate: 'subtropical',       base_temp: 30, base_humidity: 82, base_rainfall: 25, base_wind: 8,  base_soil: 65 },
  // Odisha
  { id: 'bhubaneswar',  city: 'Bhubaneswar',  state: 'Odisha',          lat: 20.30, lon: 85.84, elevation: 45,  climate: 'tropical_humid',    base_temp: 33, base_humidity: 78, base_rainfall: 18, base_wind: 14, base_soil: 58 },
  { id: 'cuttack',      city: 'Cuttack',      state: 'Odisha',          lat: 20.46, lon: 85.88, elevation: 36,  climate: 'tropical_humid',    base_temp: 33, base_humidity: 76, base_rainfall: 16, base_wind: 12, base_soil: 55 },
  // Bihar
  { id: 'patna',        city: 'Patna',        state: 'Bihar',           lat: 25.61, lon: 85.14, elevation: 53,  climate: 'subtropical',       base_temp: 35, base_humidity: 70, base_rainfall: 14, base_wind: 10, base_soil: 50 },
  { id: 'gaya',         city: 'Gaya',         state: 'Bihar',           lat: 24.80, lon: 85.00, elevation: 111, climate: 'subtropical',       base_temp: 36, base_humidity: 65, base_rainfall: 10, base_wind: 8,  base_soil: 42 },
];

// Active location (default: Nellore)
let selectedLocation = locations.find(l => l.id === 'nellore');

// ══════════════════════════════════════════════════════════════
//  SIMULATED CNN ENGINE (Pure JavaScript)
//  Architecture: Input(5) → Conv1D(k=3) → ReLU → MaxPool → Dense → Sigmoid
// ══════════════════════════════════════════════════════════════

class SimpleCNN {
  constructor() {
    this.normalization = {
      temperature: { min: 0, max: 50 },
      humidity:    { min: 0, max: 100 },
      rainfall:    { min: 0, max: 300 },
      wind_speed:  { min: 0, max: 50 },
      soil_moisture: { min: 0, max: 100 }
    };
  }

  // Step 1: Normalize inputs to [0, 1]
  normalize(value, feature) {
    const { min, max } = this.normalization[feature];
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  // Step 2: 1D Convolution (kernel_size=3, stride=1, no padding)
  // Input: array of 5 values → Output: array of 3 values
  conv1d(input, kernel, bias) {
    const output = [];
    for (let i = 0; i <= input.length - kernel.length; i++) {
      let sum = bias;
      for (let j = 0; j < kernel.length; j++) {
        sum += input[i + j] * kernel[j];
      }
      output.push(sum);
    }
    return output;
  }

  // Step 3: ReLU Activation
  relu(input) {
    return input.map(x => Math.max(0, x));
  }

  // Step 4: Max Pooling (pool_size=2, stride=1)
  // Input: array of 3 → Output: array of 2
  maxPool(input, poolSize = 2) {
    const output = [];
    for (let i = 0; i <= input.length - poolSize; i++) {
      let maxVal = -Infinity;
      for (let j = 0; j < poolSize; j++) {
        maxVal = Math.max(maxVal, input[i + j]);
      }
      output.push(maxVal);
    }
    return output;
  }

  // Step 5: Dense (Fully Connected) Layer
  dense(input, weights, bias) {
    let sum = bias;
    for (let i = 0; i < input.length; i++) {
      sum += input[i] * weights[i];
    }
    return sum;
  }

  // Step 6: Sigmoid Activation
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  // ── Full Forward Pass ──────────────────────────────────────
  predict(weatherInput, cropProfile) {
    const { cnn_weights, yield_range, optimal } = cropProfile;

    // Normalize input features
    const normalized = [
      this.normalize(weatherInput.temperature, 'temperature'),
      this.normalize(weatherInput.humidity, 'humidity'),
      this.normalize(weatherInput.rainfall, 'rainfall'),
      this.normalize(weatherInput.wind_speed, 'wind_speed'),
      this.normalize(weatherInput.soil_moisture, 'soil_moisture')
    ];

    // Forward pass through CNN layers
    const convOutput = this.conv1d(normalized, cnn_weights.kernel, cnn_weights.conv_bias);
    const reluOutput = this.relu(convOutput);
    const poolOutput = this.maxPool(reluOutput);
    const denseOutput = this.dense(poolOutput, cnn_weights.dense_weights, cnn_weights.dense_bias);
    const score = this.sigmoid(denseOutput);

    // Scale score to yield range
    const predictedYield = yield_range.min + score * (yield_range.max - yield_range.min);

    // Calculate confidence based on how close weather is to optimal
    const confidence = this.calculateConfidence(weatherInput, optimal);

    // Determine risk level
    const risk = this.assessRisk(weatherInput, optimal, confidence);

    // Layer-by-layer trace for transparency
    const trace = {
      input_raw: weatherInput,
      input_normalized: normalized,
      conv1d_output: convOutput.map(v => +v.toFixed(4)),
      relu_output: reluOutput.map(v => +v.toFixed(4)),
      maxpool_output: poolOutput.map(v => +v.toFixed(4)),
      dense_output: +denseOutput.toFixed(4),
      sigmoid_score: +score.toFixed(4)
    };

    return {
      crop: cropProfile.name,
      predicted_yield: +predictedYield.toFixed(2),
      yield_unit: yield_range.unit,
      confidence: +confidence.toFixed(1),
      risk_level: risk.level,
      risk_factors: risk.factors,
      score: +score.toFixed(4),
      cnn_trace: trace
    };
  }

  // ── Confidence Calculation ─────────────────────────────────
  calculateConfidence(weather, optimal) {
    let totalScore = 0;
    let count = 0;

    // Temperature fitness
    if (weather.temperature >= optimal.temp_min && weather.temperature <= optimal.temp_max) {
      const mid = (optimal.temp_min + optimal.temp_max) / 2;
      const range = (optimal.temp_max - optimal.temp_min) / 2;
      totalScore += 1 - Math.abs(weather.temperature - mid) / range * 0.3;
    } else {
      const dist = weather.temperature < optimal.temp_min
        ? optimal.temp_min - weather.temperature
        : weather.temperature - optimal.temp_max;
      totalScore += Math.max(0, 1 - dist / 15);
    }
    count++;

    // Humidity fitness
    if (weather.humidity >= optimal.humidity_min && weather.humidity <= optimal.humidity_max) {
      totalScore += 0.95;
    } else {
      const dist = weather.humidity < optimal.humidity_min
        ? optimal.humidity_min - weather.humidity
        : weather.humidity - optimal.humidity_max;
      totalScore += Math.max(0, 1 - dist / 30);
    }
    count++;

    // Soil moisture fitness
    if (weather.soil_moisture >= optimal.soil_moisture_min && weather.soil_moisture <= optimal.soil_moisture_max) {
      totalScore += 0.95;
    } else {
      const dist = weather.soil_moisture < optimal.soil_moisture_min
        ? optimal.soil_moisture_min - weather.soil_moisture
        : weather.soil_moisture - optimal.soil_moisture_max;
      totalScore += Math.max(0, 1 - dist / 25);
    }
    count++;

    // Wind fitness
    if (weather.wind_speed <= optimal.wind_max) {
      totalScore += 0.9;
    } else {
      totalScore += Math.max(0, 1 - (weather.wind_speed - optimal.wind_max) / 20);
    }
    count++;

    return (totalScore / count) * 100;
  }

  // ── Risk Assessment ────────────────────────────────────────
  assessRisk(weather, optimal, confidence) {
    const factors = [];

    if (weather.temperature > optimal.temp_max + 5) {
      factors.push('Extreme heat stress — above crop tolerance');
    } else if (weather.temperature > optimal.temp_max) {
      factors.push('Temperature above optimal range');
    }
    if (weather.temperature < optimal.temp_min - 3) {
      factors.push('Cold stress — below crop tolerance');
    }
    if (weather.humidity > optimal.humidity_max + 15) {
      factors.push('Excess humidity — fungal disease risk');
    }
    if (weather.soil_moisture > optimal.soil_moisture_max + 10) {
      factors.push('Waterlogging risk — excess soil moisture');
    }
    if (weather.soil_moisture < optimal.soil_moisture_min - 10) {
      factors.push('Drought stress — insufficient soil moisture');
    }
    if (weather.wind_speed > optimal.wind_max) {
      factors.push('High winds — lodging and physical damage risk');
    }
    if (weather.rainfall > 60) {
      factors.push('Heavy rainfall — flooding and erosion risk');
    }

    let level;
    if (confidence >= 80 && factors.length === 0) level = 'low';
    else if (confidence >= 60 && factors.length <= 1) level = 'moderate';
    else if (confidence >= 40) level = 'high';
    else level = 'critical';

    if (factors.length === 0) factors.push('No significant risk factors detected');

    return { level, factors };
  }
}

const cnn = new SimpleCNN();

// ══════════════════════════════════════════════════════════════
//  WEATHER SIMULATION ENGINE
// ══════════════════════════════════════════════════════════════

function simulateCurrentWeather() {
  const loc = selectedLocation;
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();

  // Time-based micro-variations for "live" feel
  const seed = (hour * 60 + minute) / 1440;
  const variation = Math.sin(seed * Math.PI * 2);

  // Diurnal temperature cycle: cooler at night, warmer afternoon
  const diurnal = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 4;

  const temperature = +(loc.base_temp + diurnal + variation * 1.5).toFixed(1);
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Rain', 'Heavy Rain'];
  const conditionCodes = ['sunny', 'partly_cloudy', 'cloudy', 'light_rain', 'rain', 'heavy_rain'];
  let condIdx = loc.base_rainfall > 15 ? 3 + Math.round(Math.random()) : loc.base_humidity > 65 ? 1 + Math.round(Math.random()) : Math.round(Math.random());
  condIdx = Math.min(condIdx, 5);

  return {
    temperature,
    feels_like: +(temperature + (loc.base_humidity > 60 ? 3 : 1) + variation).toFixed(1),
    humidity: Math.round(Math.min(100, Math.max(20, loc.base_humidity + variation * 6 + diurnal * -1.5))),
    rainfall: +(Math.max(0, loc.base_rainfall + variation * 5 + (Math.random() - 0.4) * 8)).toFixed(1),
    wind_speed: +(Math.max(1, loc.base_wind + variation * 3 + (Math.random() - 0.5) * 4)).toFixed(1),
    wind_direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(((hour * 45 + loc.lat * 10) % 360) / 45)],
    soil_moisture: Math.round(Math.min(100, Math.max(10, loc.base_soil + variation * 3))),
    pressure: Math.round(1013 - loc.elevation * 0.012 + variation * 3),
    uv_index: Math.max(1, Math.round(8 + diurnal * 0.8 - (loc.base_humidity > 70 ? 2 : 0))),
    visibility: Math.round(Math.max(2, 10 - loc.base_humidity * 0.05 + variation)),
    condition: conditions[condIdx],
    condition_code: conditionCodes[condIdx],
    last_updated: new Date().toISOString()
  };
}

function simulateForecast() {
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Rain', 'Heavy Rain', 'Thunderstorm'];
  const conditionCodes = ['sunny', 'partly_cloudy', 'cloudy', 'light_rain', 'rain', 'heavy_rain', 'thunderstorm'];
  const forecast = [];
  const today = new Date();

  // Use selected location's climate to seed forecast trends
  const loc = selectedLocation;
  const avgTemp = loc.base_temp;
  const avgHumidity = loc.base_humidity;
  const avgRainfall = loc.base_rainfall;

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    // Monsoon pattern: alternating wet and dry spells
    const dayVariation = Math.sin((i / 7) * Math.PI * 2 + today.getDate());
    const rainfall = +(Math.max(0, avgRainfall + dayVariation * 25 + (Math.random() - 0.3) * 15)).toFixed(1);
    const humidity = Math.round(Math.min(98, Math.max(35, avgHumidity + dayVariation * 12)));
    const tempMax = +(avgTemp + 5 - dayVariation * 4 + (Math.random() - 0.5) * 3).toFixed(1);
    const tempMin = +(tempMax - 6 - Math.random() * 3).toFixed(1);

    let condIdx;
    if (rainfall > 40) condIdx = 5 + Math.round(Math.random());
    else if (rainfall > 20) condIdx = 4;
    else if (rainfall > 5) condIdx = 3;
    else if (humidity > 70) condIdx = 2;
    else if (humidity > 50) condIdx = 1;
    else condIdx = 0;

    forecast.push({
      date: date.toISOString().split('T')[0],
      day_name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      temp_max: tempMax,
      temp_min: tempMin,
      humidity,
      rainfall,
      wind_speed: +(5 + Math.random() * 20 + (rainfall > 30 ? 10 : 0)).toFixed(1),
      condition: conditions[condIdx],
      condition_code: conditionCodes[condIdx]
    });
  }

  return forecast;
}

// ══════════════════════════════════════════════════════════════
//  ADVISORY ENGINE
// ══════════════════════════════════════════════════════════════

function generateAdvisories(weather) {
  const currentMonth = new Date().getMonth() + 1;
  const active = [];

  for (const template of advisoriesData.templates) {
    const c = template.conditions;
    let matches = true;

    if (c.rainfall_above !== undefined && weather.rainfall < c.rainfall_above) matches = false;
    if (c.rainfall_below !== undefined && weather.rainfall > c.rainfall_below) matches = false;
    if (c.humidity_above !== undefined && weather.humidity < c.humidity_above) matches = false;
    if (c.humidity_below !== undefined && weather.humidity > c.humidity_below) matches = false;
    if (c.temp_above !== undefined && weather.temperature < c.temp_above) matches = false;
    if (c.temp_below !== undefined && weather.temperature > c.temp_below) matches = false;
    if (c.soil_moisture_above !== undefined && weather.soil_moisture < c.soil_moisture_above) matches = false;
    if (c.soil_moisture_below !== undefined && weather.soil_moisture > c.soil_moisture_below) matches = false;
    if (c.soil_moisture_min !== undefined && weather.soil_moisture < c.soil_moisture_min) matches = false;
    if (c.soil_moisture_max !== undefined && weather.soil_moisture > c.soil_moisture_max) matches = false;
    if (c.wind_above !== undefined && weather.wind_speed < c.wind_above) matches = false;
    if (c.rainfall_forecast_above !== undefined) matches = false; // Requires forecast context
    if (c.month_in && !c.month_in.includes(currentMonth)) matches = false;

    if (matches) {
      active.push({
        id: template.id,
        category: template.category,
        icon: template.icon,
        title: template.title,
        message: template.message,
        priority: template.priority,
        generated_at: new Date().toISOString()
      });
    }
  }

  // Sort by priority (critical first)
  const priorityOrder = { critical: 0, warning: 1, info: 2 };
  active.sort((a, b) => (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3));

  return active;
}

// ══════════════════════════════════════════════════════════════
//  API ROUTES
// ══════════════════════════════════════════════════════════════

// List all locations grouped by state
app.get('/api/locations', (req, res) => {
  const grouped = {};
  for (const loc of locations) {
    if (!grouped[loc.state]) grouped[loc.state] = [];
    grouped[loc.state].push({ id: loc.id, city: loc.city, climate: loc.climate });
  }
  res.json({
    success: true,
    data: {
      states: Object.keys(grouped).sort(),
      locations: grouped,
      selected: selectedLocation.id
    }
  });
});

// Switch active location
app.post('/api/location/select', (req, res) => {
  const { location_id } = req.body;
  const loc = locations.find(l => l.id === location_id);
  if (!loc) {
    return res.status(404).json({ success: false, error: `Location '${location_id}' not found` });
  }
  selectedLocation = loc;
  res.json({
    success: true,
    data: { id: loc.id, city: loc.city, state: loc.state, lat: loc.lat, lon: loc.lon }
  });
});

// Current weather
app.get('/api/weather/current', (req, res) => {
  const current = simulateCurrentWeather();
  const loc = selectedLocation;
  res.json({
    success: true,
    data: {
      location: { name: `${loc.city}, ${loc.state}`, lat: loc.lat, lon: loc.lon, elevation: loc.elevation },
      current
    }
  });
});

// 7-day forecast
app.get('/api/weather/forecast', (req, res) => {
  res.json({
    success: true,
    data: simulateForecast()
  });
});

// Historical weather data (30 days)
app.get('/api/weather/history', (req, res) => {
  res.json({
    success: true,
    data: weatherData.history
  });
});

// Weather alerts
app.get('/api/alerts', (req, res) => {
  const activeAlerts = weatherData.alerts.filter(a => a.active);
  res.json({
    success: true,
    data: activeAlerts
  });
});

// List all crops
app.get('/api/crops', (req, res) => {
  const crops = cropsData.crops.map(c => ({
    id: c.id,
    name: c.name,
    emoji: c.emoji,
    category: c.category,
    season: c.season,
    sowing_months: c.sowing_months,
    harvest_months: c.harvest_months,
    growth_duration_days: c.growth_duration_days,
    water_requirement: c.water_requirement,
    description: c.description,
    yield_range: c.yield_range,
    fertilizers: c.fertilizers
  }));
  res.json({ success: true, data: crops });
});

// CNN Prediction endpoint
app.post('/api/predict', (req, res) => {
  const { crop_id, weather_override } = req.body;

  if (!crop_id) {
    return res.status(400).json({ success: false, error: 'crop_id is required' });
  }

  const crop = cropsData.crops.find(c => c.id === crop_id);
  if (!crop) {
    return res.status(404).json({ success: false, error: `Crop '${crop_id}' not found` });
  }

  // Use current weather or override
  const weather = weather_override || simulateCurrentWeather();
  const weatherInput = {
    temperature: weather.temperature || weather.temp_max || 30,
    humidity: weather.humidity || 70,
    rainfall: weather.rainfall || 10,
    wind_speed: weather.wind_speed || 12,
    soil_moisture: weather.soil_moisture || 50
  };

  const prediction = cnn.predict(weatherInput, crop);

  res.json({
    success: true,
    data: {
      ...prediction,
      fertilizers: crop.fertilizers,
      weather_used: weatherInput,
      model_info: {
        type: 'Simulated 1D-CNN',
        architecture: 'Input(5) → Conv1D(k=3) → ReLU → MaxPool(2) → Dense(1) → Sigmoid',
        parameters: 12
      }
    }
  });
});

// Batch prediction for all crops
app.get('/api/predict/all', (req, res) => {
  const weather = simulateCurrentWeather();
  const weatherInput = {
    temperature: weather.temperature,
    humidity: weather.humidity,
    rainfall: weather.rainfall,
    wind_speed: weather.wind_speed,
    soil_moisture: weather.soil_moisture
  };

  const predictions = cropsData.crops.map(crop => {
    const pred = cnn.predict(weatherInput, crop);
    return {
      crop_id: crop.id,
      crop_name: crop.name,
      emoji: crop.emoji,
      predicted_yield: pred.predicted_yield,
      yield_unit: pred.yield_unit,
      confidence: pred.confidence,
      risk_level: pred.risk_level,
      score: pred.score
    };
  });

  res.json({
    success: true,
    data: { weather: weatherInput, predictions }
  });
});

// Smart advisories based on current conditions
app.get('/api/advisories', (req, res) => {
  const weather = simulateCurrentWeather();
  const advisories = generateAdvisories(weather);
  res.json({
    success: true,
    data: {
      weather_snapshot: {
        temperature: weather.temperature,
        humidity: weather.humidity,
        rainfall: weather.rainfall,
        soil_moisture: weather.soil_moisture
      },
      advisories
    }
  });
});

// ── Server Start ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║   🌾 AgriSense — Smart Crop Forecasting     ║');
  console.log('  ║   Server running on http://localhost:' + PORT + '    ║');
  console.log('  ╚══════════════════════════════════════════════╝');
  console.log('');
  console.log('  📡 API Endpoints:');
  console.log('  ├── GET  /api/weather/current   → Live weather');
  console.log('  ├── GET  /api/weather/forecast   → 7-day forecast');
  console.log('  ├── GET  /api/weather/history    → 30-day history');
  console.log('  ├── GET  /api/crops              → Crop profiles');
  console.log('  ├── POST /api/predict            → CNN prediction');
  console.log('  ├── GET  /api/predict/all        → All crop predictions');
  console.log('  ├── GET  /api/advisories         → Smart advisories');
  console.log('  └── GET  /api/alerts             → Weather alerts');
  console.log('');
});
