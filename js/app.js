document.addEventListener("DOMContentLoaded", () => {
  const state = {
    locationName: "Bengaluru — Silk Board Junction, Karnataka",
    lat: 12.9177,
    lon: 77.6238,
    metrics: { pm25: 80, pm10: 142, no2: 48, o3: 36, so2: 14, co: 1.1 },
    hourlyPm25: null,
    lang: "en",
    chart: null
  };

  // Populate quick reference hub dropdown
  const presetSelect = document.getElementById("preset-station-select");
  VayuData.PRESET_STATIONS.forEach((st, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = st.name;
    presetSelect.appendChild(opt);
  });

  function renderDashboard() {
    const naqi = VayuEngine.computeNAQI(state.metrics);

    document.getElementById("active-location-label").textContent = state.locationName;
    document.getElementById("active-location-coords").textContent = `(${state.lat.toFixed(4)}°N, ${state.lon.toFixed(4)}°E)`;

    const scoreEl = document.getElementById("aqi-score-value");
    scoreEl.textContent = naqi.aqi;
    scoreEl.className = `text-6xl sm:text-7xl font-extrabold tracking-tight ${naqi.colorClass}`;

    const badgeEl = document.getElementById("aqi-category-badge");
    badgeEl.textContent = naqi.category;
    badgeEl.className = `px-3 py-1 rounded-full text-xs font-bold border ${naqi.badgeClass}`;

    document.getElementById("dominant-pollutant-label").textContent = naqi.dominant;
    document.getElementById("cigarette-equiv-label").textContent = `≈ ${naqi.cigarettes} cigarettes / day passive intake`;
    document.getElementById("aqi-plain-explanation").textContent = naqi.explanation;

    document.getElementById("slider-pm25-val").textContent = `${state.metrics.pm25} µg/m³`;
    document.getElementById("pm25-simulator-slider").value = Math.min(450, state.metrics.pm25);

    document.getElementById("metric-pm25").innerHTML = `${state.metrics.pm25} <span class="text-xs font-normal text-slate-400">µg/m³</span>`;
    document.getElementById("subindex-pm25").textContent = `Sub-Index: ${naqi.subPm25}`;
    document.getElementById("metric-pm10").innerHTML = `${state.metrics.pm10} <span class="text-xs font-normal text-slate-400">µg/m³</span>`;
    document.getElementById("subindex-pm10").textContent = `Sub-Index: ${naqi.subPm10}`;
    document.getElementById("metric-no2").innerHTML = `${state.metrics.no2} <span class="text-xs font-normal text-slate-400">µg/m³</span>`;
    document.getElementById("metric-o3").innerHTML = `${state.metrics.o3} <span class="text-xs font-normal text-slate-400">µg/m³</span>`;
    document.getElementById("metric-so2").innerHTML = `${state.metrics.so2} <span class="text-xs font-normal text-slate-400">µg/m³</span>`;
    document.getElementById("metric-co").innerHTML = `${state.metrics.co} <span class="text-xs font-normal text-slate-400">mg/m³</span>`;

    // Render Demographic Cards
    const demoGrid = document.getElementById("demographic-cards-grid");
    demoGrid.innerHTML = VayuEngine.getDemographicAdvice(naqi.aqi)
      .map(
        (d) => `
        <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-white">${d.title}</span>
            <span class="text-[11px] font-semibold text-emerald-400">${d.status}</span>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">${d.text}</p>
        </div>`
      )
      .join("");

    // Render Home Action Checklist
    const checklist = document.getElementById("home-action-checklist");
    checklist.innerHTML = `
      <div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div class="font-semibold text-emerald-300">🪟 Window Protocol</div>
        <div class="text-slate-400 mt-1">${naqi.aqi > 150 ? "Keep windows closed; seal door gaps with draft stoppers." : "Cross-ventilate between 1 PM and 4 PM."}</div>
      </div>
      <div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div class="font-semibold text-sky-300">🌀 HEPA Purifier</div>
        <div class="text-slate-400 mt-1">${naqi.aqi > 120 ? "Run HEPA purifier on Auto/High in bedrooms." : "Eco mode sufficient; clean pre-filter weekly."}</div>
      </div>
      <div class="p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div class="font-semibold text-amber-300">🌿 Indoor Hygiene</div>
        <div class="text-slate-400 mt-1">Wet-mop floors instead of dry sweeping to prevent dust resuspension.</div>
      </div>
    `;

    updateCommuteCalculator();
    renderVentilationChart();
  }

  function updateCommuteCalculator() {
    const minutes = document.getElementById("commute-minutes").value;
    const activity = document.getElementById("commute-activity").value;
    const mask = document.getElementById("commute-mask").value;
    const dose = VayuEngine.computeCommuteDose(state.metrics.pm25, minutes, activity, mask);

    document.getElementById("dose-unmasked").textContent = `${dose.unmaskedDose} µg`;
    document.getElementById("dose-protected").textContent = `${dose.protectedDose} µg`;
  }

  function renderVentilationChart() {
    const curve = VayuEngine.buildDiurnalCurve(state.metrics.pm25, state.hourlyPm25);
    const ctx = document.getElementById("ventilation-chart").getContext("2d");

    if (state.chart) state.chart.destroy();

    state.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: curve.map((c) => c.hourLabel),
        datasets: [
          {
            label: "PM2.5 (µg/m³)",
            data: curve.map((c) => c.pm25),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.14)",
            fill: true,
            tension: 0.35,
            pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: "#94a3b8", maxTicksLimit: 8 }, grid: { color: "rgba(51,65,85,0.3)" } },
          y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(51,65,85,0.3)" } }
        }
      }
    });
  }

  async function selectLocation(name, lat, lon) {
    state.locationName = name;
    state.lat = lat;
    state.lon = lon;
    document.getElementById("data-source-badge").textContent = "Fetching live satellite & ground telemetry...";

    try {
      const live = await VayuAPI.fetchLiveAirQuality(lat, lon);
      state.metrics = {
        pm25: live.pm25,
        pm10: live.pm10,
        no2: live.no2,
        o3: live.o3,
        so2: live.so2,
        co: live.co
      };
      state.hourlyPm25 = live.hourlyPm25;
      document.getElementById("data-source-badge").textContent = "Source: Live Open-Meteo Telemetry • CPCB NAQI";
    } catch {
      document.getElementById("data-source-badge").textContent = "Source: Offline Fallback Model • CPCB NAQI";
    }
    renderDashboard();
  }

  // Pan-India Search Autocomplete
  let searchTimer = null;
  const searchInput = document.getElementById("location-search-input");
  const dropdown = document.getElementById("search-results-dropdown");
  const spinner = document.getElementById("search-spinner");

  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    const query = searchInput.value.trim();
    if (query.length < 2) {
      dropdown.classList.add("hidden");
      return;
    }

    searchTimer = setTimeout(async () => {
      spinner.classList.remove("hidden");
      const matches = await VayuAPI.searchPanIndiaLocations(query);
      spinner.classList.add("hidden");

      if (!matches.length) {
        dropdown.innerHTML = `<div class="p-3 text-xs text-slate-400">No village or city matched "${query}". Try a nearby town or 6-digit PIN.</div>`;
      } else {
        dropdown.innerHTML = matches
          .map(
            (m, i) => `
            <button type="button" data-idx="${i}" class="w-full text-left px-4 py-2.5 hover:bg-slate-800 flex items-center justify-between gap-2 transition">
              <span class="text-xs sm:text-sm text-white font-medium">${m.name}</span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">${m.type}</span>
            </button>`
          )
          .join("");

        dropdown.querySelectorAll("button").forEach((btn) => {
          btn.addEventListener("click", () => {
            const chosen = matches[Number(btn.dataset.idx)];
            searchInput.value = chosen.name;
            dropdown.classList.add("hidden");
            selectLocation(chosen.name, chosen.lat, chosen.lon);
          });
        });
      }
      dropdown.classList.remove("hidden");
    }, 350);
  });

  // Live GPS Geolocation Button
  document.getElementById("btn-live-gps").addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    document.getElementById("data-source-badge").textContent = "Detecting GPS coordinates...";
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const resolvedName = await VayuAPI.reverseGeocodeIndia(latitude, longitude);
        await selectLocation(resolvedName, latitude, longitude);
      },
      () => {
        alert("Location permission denied. Please search your village, city, or PIN code manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  // Quick Preset Hub Selection
  presetSelect.addEventListener("change", (e) => {
    if (e.target.value === "") return;
    const st = VayuData.PRESET_STATIONS[Number(e.target.value)];
    state.locationName = st.name;
    state.lat = st.lat;
    state.lon = st.lon;
    state.metrics = { pm25: st.pm25, pm10: st.pm10, no2: st.no2, o3: st.o3, so2: st.so2, co: st.co };
    state.hourlyPm25 = null;
    document.getElementById("data-source-badge").textContent = "Source: Reference Station Preset • CPCB NAQI";
    renderDashboard();
  });

  // Simulator Slider
  document.getElementById("pm25-simulator-slider").addEventListener("input", (e) => {
    state.metrics.pm25 = Number(e.target.value);
    state.hourlyPm25 = null;
    renderDashboard();
  });

  // Commute Inputs
  ["commute-minutes", "commute-activity", "commute-mask"].forEach((id) => {
    document.getElementById(id).addEventListener("change", updateCommuteCalculator);
    document.getElementById(id).addEventListener("input", updateCommuteCalculator);
  });

  // Language Switcher
  document.getElementById("language-select").addEventListener("change", (e) => {
    state.lang = e.target.value;
    const t = VayuData.TRANSLATIONS[state.lang] || VayuData.TRANSLATIONS.en;
    document.getElementById("ui-subtitle").textContent = t.subtitle;
    document.getElementById("ui-read-aloud").textContent = t.readAloud;
    document.getElementById("ui-voice-ask").textContent = t.voiceAsk;
    document.getElementById("ui-live-gps").textContent = t.liveGps;
    document.getElementById("ui-aqi-title").textContent = t.aqiTitle;
    document.getElementById("ui-demo-heading").textContent = t.demoHeading;
    document.getElementById("ui-vent-heading").textContent = t.ventHeading;
    document.getElementById("ui-commute-heading").textContent = t.commuteHeading;
    document.getElementById("ui-ai-heading").textContent = t.aiHeading;
  });

  // Voice Read-Aloud (Text-to-Speech)
  document.getElementById("btn-voice-read").addEventListener("click", () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const naqi = VayuEngine.computeNAQI(state.metrics);
    const summary = `Air quality report for ${state.locationName}. The CPCB AQI is ${naqi.aqi}, which is ${naqi.category}. Primary pollutant is ${naqi.dominant}. ${naqi.explanation}`;
    const utter = new SpeechSynthesisUtterance(summary);
    window.speechSynthesis.speak(utter);
  });

  // Voice Input (Speech-to-Text)
  document.getElementById("btn-voice-ask").addEventListener("click", () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice recognition is supported in Chrome, Edge, and Android browsers.");
      return;
    }
    const rec = new SpeechRec();
    rec.lang = state.lang === "hi" ? "hi-IN" : state.lang === "kn" ? "kn-IN" : state.lang === "ta" ? "ta-IN" : state.lang === "mr" ? "mr-IN" : "en-IN";
    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById("ai-question-input").value = transcript;
      document.getElementById("btn-ask-ai").click();
    };
    rec.start();
  });

  // AI Co-Pilot Button
  document.getElementById("btn-ask-ai").addEventListener("click", async () => {
    const box = document.getElementById("ai-response-box");
    const question = document.getElementById("ai-question-input").value;
    const apiKey = document.getElementById("gemini-api-key").value;
    const naqi = VayuEngine.computeNAQI(state.metrics);

    box.textContent = "Generating tailored mitigation plan...";
    const reply = await VayuAPI.generateGeminiAdvice({
      apiKey,
      locationName: state.locationName,
      metrics: state.metrics,
      naqi,
      question,
      lang: state.lang
    });
    box.innerHTML = reply.replace(/\n/g, "<br/>");
  });

  // Initial render
  renderDashboard();
});
