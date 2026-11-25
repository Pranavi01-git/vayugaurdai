window.VayuAPI = {
  async searchPanIndiaLocations(query) {
    const q = query.trim();
    if (!q) return [];

    // Tier 1: 6-Digit Indian PIN Code Lookup via India Post + Nominatim coordinates
    if (/^\d{6}$/.test(q)) {
      try {
        const pinRes = await fetch(`https://api.postalpincode.in/pincode/${q}`);
        const pinData = await pinRes.json();
        if (pinData?.[0]?.Status === "Success" && Array.isArray(pinData[0].PostOffice)) {
          const offices = pinData[0].PostOffice.slice(0, 6);
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?postalcode=${q}&country=India&format=json&limit=1`
          );
          const geoData = await geoRes.json();
          const lat = geoData?.[0] ? parseFloat(geoData[0].lat) : 20.5937;
          const lon = geoData?.[0] ? parseFloat(geoData[0].lon) : 78.9629;

          return offices.map((po) => ({
            name: `${po.Name} (${po.Block || po.Taluk || po.District}), ${po.State} — PIN ${q}`,
            type: "Village / Post Office",
            lat,
            lon
          }));
        }
      } catch (err) {
        console.warn("PIN lookup fallback triggered:", err);
      }
    }

    const results = [];

    // Tier 2: Open-Meteo India Geocoding (Fast cities, towns, districts)
    try {
      const omUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json&countryCode=IN`;
      const omRes = await fetch(omUrl);
      const omData = await omRes.json();
      if (Array.isArray(omData.results)) {
        omData.results.forEach((item) => {
          const badge = (item.population || 0) < 25000 ? "Village / Town" : "City / District";
          results.push({
            name: `${item.name}${item.admin2 ? `, ${item.admin2}` : ""}${item.admin1 ? `, ${item.admin1}` : ""}`,
            type: badge,
            lat: item.latitude,
            lon: item.longitude
          });
        });
      }
    } catch (err) {
      console.warn("Open-Meteo geocoding error:", err);
    }

    // Tier 3: OpenStreetMap Nominatim India Fallback for small villages & hamlets
    if (results.length < 5) {
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ", India")}&format=json&addressdetails=1&limit=8&countrycodes=in`;
        const nomRes = await fetch(nomUrl);
        const nomData = await nomRes.json();
        if (Array.isArray(nomData)) {
          nomData.forEach((place) => {
            const addr = place.address || {};
            const villageName = addr.village || addr.hamlet || addr.suburb || addr.town || addr.city || place.display_name.split(",")[0];
            const district = addr.state_district || addr.county || "";
            const state = addr.state || "";
            const label = [villageName, district, state].filter(Boolean).join(", ");

            if (!results.some((r) => r.name.toLowerCase() === label.toLowerCase())) {
              results.push({
                name: label || place.display_name,
                type: addr.village || addr.hamlet ? "Village / Gram" : "Locality / Town",
                lat: parseFloat(place.lat),
                lon: parseFloat(place.lon)
              });
            }
          });
        }
      } catch (err) {
        console.warn("Nominatim village lookup error:", err);
      }
    }

    return results.slice(0, 10);
  },

  async reverseGeocodeIndia(lat, lon) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
      const res = await fetch(url);
      const data = await res.json();
      const a = data.address || {};
      const locality = a.village || a.suburb || a.neighbourhood || a.town || a.city || "Current GPS Location";
      const district = a.state_district || a.county || "";
      const state = a.state || "India";
      const pin = a.postcode ? ` — PIN ${a.postcode}` : "";
      return `${[locality, district, state].filter(Boolean).join(", ")}${pin}`;
    } catch {
      return `Live GPS Location (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`;
    }
  },

  async fetchLiveAirQuality(lat, lon) {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}¤t=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm2_5&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Live Air Quality API unavailable");
    const data = await res.json();
    const cur = data.current || {};

    return {
      pm25: Math.round(cur.pm2_5 ?? 45),
      pm10: Math.round(cur.pm10 ?? 85),
      no2: Math.round(cur.nitrogen_dioxide ?? 22),
      o3: Math.round(cur.ozone ?? 38),
      so2: Math.round(cur.sulphur_dioxide ?? 10),
      co: Number(((cur.carbon_monoxide ?? 600) / 1000).toFixed(2)), // convert µg/m³ to mg/m³
      hourlyPm25: data.hourly?.pm2_5 || null
    };
  },

  async generateGeminiAdvice({ apiKey, locationName, metrics, naqi, question, lang }) {
    const prompt = `You are VayuGuard AI, an empathetic, practical air quality and public health assistant in India.
Location: ${locationName}
Exact CPCB NAQI: ${naqi.aqi} (${naqi.category}), Dominant Pollutant: ${naqi.dominant}
Measured Pollutants: PM2.5=${metrics.pm25} µg/m³, PM10=${metrics.pm10} µg/m³, NO2=${metrics.no2} µg/m³, O3=${metrics.o3} µg/m³
Passive Cigarette Equivalence: ${naqi.cigarettes} cigarettes/day
User Language Code: ${lang}
User Question: "${question || "Provide a concise 3-bullet family & respiratory safety action plan for today."}"

Rules:
1. Do NOT recalculate or alter the numbers above; cite them accurately.
2. Reply in the requested language (${lang}) using clear, plain-language bullet points for everyday citizens.`;

    if (apiKey && apiKey.trim().startsWith("AIza")) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const json = await res.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    }

    // Deterministic built-in fallback coach when no API key is entered
    return `• Current Exposure (${locationName}): CPCB AQI is ${naqi.aqi} (${naqi.category}) driven by ${naqi.dominant} at ${metrics.pm25} µg/m³.\n• Ventilation & Home Action: ${naqi.aqi > 150 ? "Keep exterior doors/windows sealed during morning and evening traffic peaks; run a HEPA purifier on medium-high." : "Open windows during the afternoon breeze (1:00 PM – 4:00 PM) to refresh indoor air."}\n• Commute & Family Care: ${naqi.aqi > 120 ? "Wear a snug N95/FFP2 mask on two-wheelers or walks, and keep children and seniors away from busy roads." : "Outdoor walks are generally safe; stay hydrated and avoid heavy vehicle exhaust corridors."}`;
  }
};
