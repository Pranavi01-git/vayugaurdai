# VayuGaurd-AI
VayuGuard is a cross-platform, hyper-local Urban Air Quality Assistant built for both mobile and desktop users to turn complex environmental metrics into immediate, personalized health decisions. By combining real-time pollutant data with user health profiles. It identifies the safest daily windows for outdoor activities and indoor ventilation.
# VayuGuard AI — Pan-India Air Quality & Smog Mitigation Assistant

**VayuGuard AI** is a responsive, cross-platform air quality monitoring and personal smog mitigation web application built for Indian cities, towns, and rural villages. It combines a **deterministic regulatory & physiological calculation engine** with **Pan-India universal geocoding** and **multilingual AI health coaching**—preventing LLM math hallucinations while delivering actionable daily protection plans.

---

## Key Features

### 1. Pan-India Universal Location Search & Live GPS
- **3-Tier Cascading Indian Geocoder**:
  1. **6-Digit PIN Code Lookup**: Queries India Post (`api.postalpincode.in`) to resolve individual branch post offices and villages under any Indian PIN code.
  2. **Open-Meteo India Geocoding**: Fast search across Indian cities, districts, and talukas (`countryCode=IN`).
  3. **OpenStreetMap Nominatim Fallback**: Automatically queries granular administrative boundaries so even small rural villages, hamlets, and gram panchayats are discoverable.
- **One-Tap Live GPS Geolocation**: Uses browser geolocation paired with reverse geocoding to pinpoint your current locality, district, state, and PIN code.
- **Quick Reference Stations & What-If Simulator**: Includes 13 major Indian urban/rural benchmark hubs plus a live $\text{PM}_{2.5}$ slider ($5\text{–}450\ \mu\text{g/m}^3$) to simulate pollution spikes.

### 2. Deterministic CPCB NAQI & Exposure Engine
- Computes exact **Central Pollution Control Board (CPCB) National Air Quality Index** sub-indices and identifies the dominant pollutant ($\text{PM}_{2.5}$ vs. $\text{PM}_{10}$).
- Tracks 6 core atmospheric parameters: $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{O}_3$, $\text{SO}_2$, and $\text{CO}$.
- Converts daily $\text{PM}_{2.5}$ exposure into passive cigarette equivalence using the Berkeley Earth benchmark ($\approx 22\ \mu\text{g/m}^3$ over 24 hours $\approx 1$ cigarette in particulate mass).

### 3. Personalized Family & Demographic Advisories
- Generates real-time risk guidance tailored to four vulnerable groups:
  - **Children & Schools** (outdoor play & PE scheduling)
  - **Asthma & Respiratory Patients** (inhaler & corridor alerts)
  - **Outdoor Runners & Cyclists** (aerobic ventilation adjustments)
  - **Seniors (65+)** (morning/night inversion precautions)

### 4. 24-Hour Smart Ventilation & Home Air Plan
- Plots an interactive **Chart.js** 24-hour particulate curve combining live hourly forecasts with urban boundary-layer dispersion patterns.
- Highlights safer afternoon cross-ventilation windows versus morning and late-evening temperature-inversion trapping peaks, paired with HEPA purifier and wet-mopping guidance.

### 5. Commute & Mask Filtration Dose Calculator
- Calculates unmasked vs. protected inhaled $\text{PM}_{2.5}$ mass (in micrograms, $\mu\text{g}$) based on trip duration, physical exertion breathing rate, and mask filtration grade (Cloth, 3-Ply Surgical, or well-fitted N95/FFP2).

### 6. Multilingual UI, Voice Support & Gemini AI Co-Pilot
- **5 Indian Languages**: Instant interface localization for **English**, **Hindi (हिन्दी)**, **Kannada (ಕನ್ನಡ)**, **Tamil (தமிழ்)**, and **Marathi (मराठी)**.
- **Web Speech Voice Accessibility**: Built-in **Read Report** (Text-to-Speech) and **Ask by Voice** (Speech-to-Text) controls for hands-free and non-technical accessibility.
- **Gemini AI Co-Pilot**: Translates pre-computed deterministic telemetry into plain-language family action plans (works out-of-the-box with a deterministic rule engine, or connects to `gemini-2.5-flash` when a user supplies an optional Gemini API key).

---

## Architecture: Deterministic Math + Generative AI

Large language models can make arithmetic errors when estimating air quality indices or respiratory doses. **VayuGuard AI** enforces a strict separation of concerns:

1. **Deterministic Layer (`js/engine.js`)**:
   - **CPCB NAQI Piecewise Linear Interpolation**:
     $$I_p = \frac{I_{HI} - I_{LO}}{BP_{HI} - BP_{LO}} \times (C_p - BP_{LO}) + I_{LO}$$
   - **Pulmonary Commute Intake Model**:
     $$\text{Inhaled Dose } (\mu\text{g}) = C_{\text{PM2.5}} \times V_E \times t \times (1 - \eta)$$
     *(where $C_{\text{PM2.5}}$ is ambient concentration, $V_E$ is activity ventilation rate in $\text{m}^3/\text{hr}$, $t$ is trip duration in hours, and $\eta$ is modeled filter efficiency; real-world protection varies with mask facial seal).*
2. **Generative Layer (`js/api.js`)**:
   - Receives only verified, pre-computed numbers from `engine.js` and focuses exclusively on empathetic coaching, summarization, and regional language translation.

---

## Project Structure

```text
vayuguard-ai/
├── index.html        # Responsive Tailwind CSS layout, telemetry cards, charts & modals
├── README.md         # Project documentation & deployment instructions
├── css/
│   └── styles.css    # Custom glassmorphism styling, range sliders & scrollbars
└── js/
    ├── data.js       # Official CPCB breakpoints, 5-language dictionaries & preset hubs
    ├── engine.js     # Deterministic NAQI math, commute dose model & diurnal curve logic
    ├── api.js        # 3-tier Pan-India geocoder, GPS reverse lookup, Open-Meteo & Gemini API
    └── app.js        # DOM rendering, Chart.js lifecycle & Web Speech voice handlers
```

---

## Getting Started Locally

Because **VayuGuard AI** uses vanilla JavaScript, Tailwind CSS (via CDN), and Chart.js (via CDN), **no Node.js build step or bundler is required**.

1. **Clone or download the repository**:
   ```bash
   git clone [https://github.com/](https://github.com/)<your-username>/vayuguard-ai.git
   cd vayuguard-ai
   ```
2. **Run with any static local server** (recommended so browser Geolocation and `fetch` calls work cleanly):
   - **VS Code**: Install the *Live Server* extension, right-click `index.html`, and select **Open with Live Server**.
   - **Python**:
```bash
python3 -m http.server 8080
```
     Then open `http://localhost:8080` in your browser.

---


## Data Sources & External Services

| Service | Purpose | Notes |
| :--- | :--- | :--- |
| **Open-Meteo Air Quality API** | Real-time & hourly $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{O}_3$, $\text{SO}_2$, $\text{CO}$ | Free for non-commercial/educational use; no API key required |
| **Open-Meteo Geocoding API** | Pan-India city, town, and district coordinate lookup | Filtered with `countryCode=IN` |
| **India Post PIN Code API** | 6-digit Indian postal code to village/post-office resolution | Public endpoint (`api.postalpincode.in`) |
| **OpenStreetMap Nominatim** | Rural village/hamlet fallback & GPS reverse geocoding | Subject to standard public usage rate limits |
| **Google Gemini API (Optional)** | Custom multilingual Q&A health coaching | Runs client-side only if the user enters their own `AIza...` key |

---

## Health & Calibration Notice

- **Advisory Purpose**: This application provides environmental awareness and general exposure-reduction guidance; it is not a medical device and does not replace professional medical advice for asthma, COPD, or cardiovascular conditions.
- **Model Assumptions**: Real-time satellite/reanalysis feeds can differ slightly from nearby ground-level CPCB Continuous Ambient Air Quality Monitoring Stations (CAAQMS), and mask filtration values assume a proper facial seal.
