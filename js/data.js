window.VayuData = {
  // Official CPCB National Air Quality Index (NAQI) Breakpoints
  CPCB_BREAKPOINTS: {
    pm25: [
      { bpLo: 0, bpHi: 30, iLo: 0, iHi: 50 },
      { bpLo: 31, bpHi: 60, iLo: 51, iHi: 100 },
      { bpLo: 61, bpHi: 90, iLo: 101, iHi: 200 },
      { bpLo: 91, bpHi: 120, iLo: 201, iHi: 300 },
      { bpLo: 121, bpHi: 250, iLo: 301, iHi: 400 },
      { bpLo: 251, bpHi: 1000, iLo: 401, iHi: 500 }
    ],
    pm10: [
      { bpLo: 0, bpHi: 50, iLo: 0, iHi: 50 },
      { bpLo: 51, bpHi: 100, iLo: 51, iHi: 100 },
      { bpLo: 101, bpHi: 250, iLo: 101, iHi: 200 },
      { bpLo: 251, bpHi: 350, iLo: 201, iHi: 300 },
      { bpLo: 351, bpHi: 430, iLo: 301, iHi: 400 },
      { bpLo: 431, bpHi: 1200, iLo: 401, iHi: 500 }
    ]
  },

  PRESET_STATIONS: [
    { name: "Bengaluru — Silk Board Junction, Karnataka", lat: 12.9177, lon: 77.6238, pm25: 80, pm10: 142, no2: 48, o3: 36, so2: 14, co: 1.1 },
    { name: "Bengaluru — Indiranagar, Karnataka", lat: 12.9784, lon: 77.6408, pm25: 44, pm10: 82, no2: 29, o3: 41, so2: 9, co: 0.7 },
    { name: "Delhi — Anand Vihar, Delhi", lat: 28.6469, lon: 77.3164, pm25: 238, pm10: 390, no2: 88, o3: 52, so2: 26, co: 2.4 },
    { name: "Gurugram — Sector 51, Haryana", lat: 28.4282, lon: 77.0672, pm25: 195, pm10: 310, no2: 71, o3: 49, so2: 21, co: 1.9 },
    { name: "Mumbai — Bandra Kurla Complex, Maharashtra", lat: 19.0653, lon: 72.8687, pm25: 96, pm10: 175, no2: 54, o3: 38, so2: 18, co: 1.3 },
    { name: "Pune — Shivajinagar, Maharashtra", lat: 18.5308, lon: 73.8475, pm25: 68, pm10: 124, no2: 39, o3: 42, so2: 12, co: 0.9 },
    { name: "Chennai — Manali Industrial Area, Tamil Nadu", lat: 13.1667, lon: 80.2667, pm25: 74, pm10: 136, no2: 44, o3: 35, so2: 29, co: 1.0 },
    { name: "Hyderabad — Sanathnagar, Telangana", lat: 17.4563, lon: 78.4439, pm25: 65, pm10: 118, no2: 37, o3: 40, so2: 15, co: 0.9 },
    { name: "Kolkata — Victoria Memorial, West Bengal", lat: 22.5448, lon: 88.3426, pm25: 112, pm10: 198, no2: 61, o3: 44, so2: 19, co: 1.5 },
    { name: "Jaipur — Adarsh Nagar, Rajasthan", lat: 26.8920, lon: 75.8235, pm25: 88, pm10: 165, no2: 43, o3: 47, so2: 16, co: 1.1 },
    { name: "Lucknow — Lalbagh, Uttar Pradesh", lat: 26.8467, lon: 80.9462, pm25: 164, pm10: 270, no2: 66, o3: 45, so2: 20, co: 1.8 },
    { name: "Patna — Rajbansi Nagar, Bihar", lat: 25.6093, lon: 85.1025, pm25: 178, pm10: 292, no2: 59, o3: 41, so2: 18, co: 1.7 },
    { name: "Coorg (Madikeri) — Kodagu, Karnataka", lat: 12.4244, lon: 75.7382, pm25: 18, pm10: 34, no2: 11, o3: 28, so2: 4, co: 0.3 }
  ],

  TRANSLATIONS: {
    en: {
      subtitle: "Deterministic CPCB NAQI & Smog Mitigation Co-Pilot",
      readAloud: "Read Report",
      voiceAsk: "Ask by Voice",
      liveGps: "Use Live Location",
      aqiTitle: "CPCB National Air Quality Index",
      demoHeading: "Personalized Vulnerability Guidance",
      ventHeading: "24-Hour Smart Ventilation & Home Air Plan",
      commuteHeading: "Commute & Mask Dose Calculator",
      aiHeading: "VayuGuard AI Health & Family Action Co-Pilot"
    },
    hi: {
      subtitle: "सटीक CPCB वायु गुणवत्ता और स्मॉग सुरक्षा सहायक",
      readAloud: "रिपोर्ट सुनें",
      voiceAsk: "बोलकर पूछें",
      liveGps: "लाइव लोकेशन उपयोग करें",
      aqiTitle: "CPCB राष्ट्रीय वायु गुणवत्ता सूचकांक (AQI)",
      demoHeading: "परिवार और संवेदनशील वर्गों के लिए सलाह",
      ventHeading: "24-घंटे स्मार्ट वेंटिलेशन और घर की हवा की योजना",
      commuteHeading: "यात्रा और मास्क सुरक्षा कैलकुलेटर",
      aiHeading: "वायुगार्ड AI स्वास्थ्य और परिवार सुरक्षा मार्गदर्शक"
    },
    kn: {
      subtitle: "ನಿಖರವಾದ CPCB ವಾಯು ಗುಣಮಟ್ಟ ಮತ್ತು ಹೊಗೆ ರಕ್ಷಣಾ ಸಹಾಯಕ",
      readAloud: "ವರದಿ ಕೇಳಿ",
      voiceAsk: "ಧ್ವನಿಯ ಮೂಲಕ ಕೇಳಿ",
      liveGps: "ಲೈವ್ ಸ್ಥಳ ಬಳಸಿ",
      aqiTitle: "CPCB ರಾಷ್ಟ್ರೀಯ ವಾಯು ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕ (AQI)",
      demoHeading: "ಕುಟುಂಬ ಮತ್ತು ಆರೋಗ್ಯ ಸಲಹೆಗಳು",
      ventHeading: "24-ಗಂಟೆಗಳ ಸ್ಮಾರ್ಟ್ ವೆಂಟಿಲೇಷನ್ ಯೋಜನೆ",
      commuteHeading: "ಪ್ರಯಾಣ ಮತ್ತು ಮಾಸ್ಕ್ ರಕ್ಷಣಾ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
      aiHeading: "ವಾಯುಗಾರ್ಡ್ AI ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶಿ"
    },
    ta: {
      subtitle: "துல்லியமான CPCB காற்றின் தரம் மற்றும் புகை பாதுகாப்பு உதவியாளர்",
      readAloud: "அறிக்கையைக் கேளுங்கள்",
      voiceAsk: "குரல் மூலம் கேளுங்கள்",
      liveGps: "நேரடி இருப்பிடம்",
      aqiTitle: "CPCB தேசிய காற்றின் தரக் குறியீடு (AQI)",
      demoHeading: "குடும்பம் மற்றும் உடல்நல ஆலோசனைகள்",
      ventHeading: "24-மணி நேர ஸ்மார்ட் காற்றோட்டத் திட்டம்",
      commuteHeading: "பயணம் மற்றும் முகக்கவச பாதுகாப்பு கணக்கீடு",
      aiHeading: "வாயுகார்ட் AI சுகாதார வழிகாட்டி"
    },
    mr: {
      subtitle: "अचूक CPCB हवा गुणवत्ता आणि धुरके संरक्षण सहाय्यक",
      readAloud: "अहवाल ऐका",
      voiceAsk: "बोलून विचारा",
      liveGps: "थेट लोकेशन वापरा",
      aqiTitle: "CPCB राष्ट्रीय हवा गुणवत्ता निर्देशांक (AQI)",
      demoHeading: "कुटुंब आणि आरोग्यासाठी वैयक्तिक सल्ला",
      ventHeading: "२४-तास स्मार्ट व्हेंटिलेशन आणि घरगुती हवा योजना",
      commuteHeading: "प्रवास आणि मास्क संरक्षण कॅल्क्युलेटर",
      aiHeading: "वायुगार्ड AI आरोग्य मार्गदर्शक"
    }
  }
};
