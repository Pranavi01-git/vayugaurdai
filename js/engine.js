window.VayuEngine = {
  calculateSubIndex(concentration, breakpoints) {
    const c = Math.max(0, Number(concentration) || 0);
    for (const bp of breakpoints) {
      if (c >= bp.bpLo && c <= bp.bpHi) {
        return Math.round(((bp.iHi - bp.iLo) / (bp.bpHi - bp.bpLo)) * (c - bp.bpLo) + bp.iLo);
      }
    }
    return 500;
  },

  computeNAQI(metrics) {
    const subPm25 = this.calculateSubIndex(metrics.pm25, VayuData.CPCB_BREAKPOINTS.pm25);
    const subPm10 = this.calculateSubIndex(metrics.pm10, VayuData.CPCB_BREAKPOINTS.pm10);

    const aqi = Math.max(subPm25, subPm10);
    const dominant = subPm25 >= subPm10 ? "PM2.5" : "PM10";
    const cigarettes = ((Number(metrics.pm25) || 0) / 22).toFixed(1);

    let category = "Good";
    let colorClass = "text-emerald-400";
    let badgeClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    let explanation = "Minimal impact. Ideal air quality for outdoor exercise, school play, and natural cross-ventilation.";

    if (aqi > 400) {
      category = "Severe";
      colorClass = "text-rose-500";
      badgeClass = "bg-rose-500/20 text-rose-300 border-rose-500/40";
      explanation = "Affects healthy people and seriously impacts those with existing respiratory or heart diseases. Avoid outdoor exertion.";
    } else if (aqi > 300) {
      category = "Very Poor";
      colorClass = "text-red-400";
      badgeClass = "bg-red-500/20 text-red-300 border-red-500/40";
      explanation = "Respiratory illness likely on prolonged exposure. Keep windows sealed and run HEPA air purifiers indoors.";
    } else if (aqi > 200) {
      category = "Poor";
      colorClass = "text-orange-400";
      badgeClass = "bg-orange-500/20 text-orange-300 border-orange-500/40";
      explanation = "Breathing discomfort likely to most people on prolonged exposure. Sensitive groups should stay indoors.";
    } else if (aqi > 100) {
      category = "Moderately Polluted";
      colorClass = "text-amber-400";
      badgeClass = "bg-amber-500/20 text-amber-300 border-amber-500/40";
      explanation = "Breathing discomfort likely for people with asthma, lung conditions, children, and older adults during prolonged outdoor exertion.";
    } else if (aqi > 50) {
      category = "Satisfactory";
      colorClass = "text-lime-400";
      badgeClass = "bg-lime-500/20 text-lime-300 border-lime-500/40";
      explanation = "Minor breathing discomfort possible only for unusually sensitive individuals. Safe for normal daily routines.";
    }

    return {
      aqi,
      subPm25,
      subPm10,
      dominant,
      cigarettes,
      category,
      colorClass,
      badgeClass,
      explanation
    };
  },

  computeCommuteDose(pm25, minutes, breathingRateM3Hr, maskEfficiency) {
    const hours = (Number(minutes) || 0) / 60;
    const rate = Number(breathingRateM3Hr) || 1.2;
    const eff = Number(maskEfficiency) || 0;
    const conc = Number(pm25) || 0;

    const unmaskedDose = conc * rate * hours;
    const protectedDose = unmaskedDose * (1 - eff);

    return {
      unmaskedDose: unmaskedDose.toFixed(1),
      protectedDose: protectedDose.toFixed(1)
    };
  },

  buildDiurnalCurve(basePm25, hourlyForecastPm25 = null) {
    if (Array.isArray(hourlyForecastPm25) && hourlyForecastPm25.length >= 24) {
      return hourlyForecastPm25.slice(0, 24).map((val, idx) => ({
        hourLabel: `${String(idx).padStart(2, "0")}:00`,
        pm25: Math.round(val || basePm25)
      }));
    }

    // Deterministic urban boundary-layer diurnal multipliers
    const factors = [
      1.15, 1.12, 1.08, 1.05, 1.10, 1.22,
      1.35, 1.42, 1.30, 1.12, 0.92, 0.78,
      0.68, 0.64, 0.66, 0.72, 0.85, 1.04,
      1.24, 1.38, 1.44, 1.36, 1.28, 1.20
    ];

    return factors.map((f, idx) => ({
      hourLabel: `${String(idx).padStart(2, "0")}:00`,
      pm25: Math.max(8, Math.round(basePm25 * f))
    }));
  },

  getDemographicAdvice(aqi) {
    if (aqi <= 100) {
      return [
        { title: "👶 Children & Schools", status: "Safe Outdoors", text: "Normal outdoor sports and recess are safe. Keep hydrated." },
        { title: "🫁 Asthma / Respiratory", status: "Low Risk", text: "Carry rescue inhaler as routine precaution; normal walks permitted." },
        { title: "🏃 Runners & Cyclists", status: "Optimal", text: "Good conditions for aerobic training; prefer green parks away from main roads." },
        { title: "👴 Seniors (65+)", status: "Safe", text: "Morning and evening walks are safe and beneficial." }
      ];
    }
    if (aqi <= 200) {
      return [
        { title: "👶 Children & Schools", status: "Limit Strenuous Play", text: "Shift vigorous outdoor PE classes to afternoon dispersion hours (1–4 PM)." },
        { title: "🫁 Asthma / Respiratory", status: "Moderate Risk", text: "Avoid roadside traffic corridors; wear an N95 mask in dusty areas." },
        { title: "🏃 Runners & Cyclists", status: "Reduce Intensity", text: "Switch high-intensity runs to indoor workouts or low-traffic parks." },
        { title: "👴 Seniors (65+)", status: "Caution", text: "Avoid early morning walks before 9 AM when smog settles near ground level." }
      ];
    }
    return [
      { title: "👶 Children & Schools", status: "Keep Indoors", text: "Cancel outdoor assemblies and sports; use indoor classrooms with closed windows." },
      { title: "🫁 Asthma / Respiratory", status: "High Alert", text: "Stay indoors with HEPA filtration; keep quick-relief medication accessible." },
      { title: "🏃 Runners & Cyclists", status: "Avoid Outdoors", text: "Heavy breathing multiplies fine particulate intake up to 4x; exercise indoors." },
      { title: "👴 Seniors (65+)", status: "High Alert", text: "Stay indoors, avoid morning/night cold smog, and monitor blood pressure/breathing." }
    ];
  }
};
