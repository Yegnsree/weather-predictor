const { exec } = require("child_process");
const express = require("express");
const app = express();
app.use(express.static("public"));

// City suggestions while typing: /api/suggest?q=del
app.get("/api/suggest", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (q.length < 2) return res.json([]);
  try {
    const url = "https://geocoding-api.open-meteo.com/v1/search?count=6&language=en&name=" + encodeURIComponent(q);
    const geo = await (await fetch(url)).json();
    const places = (geo.results || []).map(p => ({
      name: p.name,
      state: p.admin1 || "",
      country: p.country || "",
      latitude: p.latitude,
      longitude: p.longitude,
    }));
    res.json(places);
  } catch (err) {
    console.log(err);
    res.json([]);
  }
});

// Weather for exact coordinates: /api/weather?lat=28.6&lon=77.2
app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  if (isNaN(lat) || isNaN(lon) || !lat || !lon) {
    return res.status(400).json({ error: "Missing or invalid location." });
  }
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon +
      "&current=temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m,relative_humidity_2m" +
      "&hourly=temperature_2m,precipitation_probability,weather_code,is_day" +
      "&timezone=auto&forecast_days=2";
    const w = await (await fetch(url)).json();

    // Start the hourly list at the current hour and keep 24 hours
    const start = Math.max(0, w.hourly.time.indexOf(w.current.time.slice(0, 13) + ":00"));
    const cut = arr => arr.slice(start, start + 24);

    res.json({
      current: w.current,
      hourly: {
        time: cut(w.hourly.time),
        temperature: cut(w.hourly.temperature_2m),
        rain: cut(w.hourly.precipitation_probability),
        code: cut(w.hourly.weather_code),
        isDay: cut(w.hourly.is_day),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not get the weather. Try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Open http://localhost:" + PORT);
  if (!process.env.PORT) exec("start chrome http://localhost:" + PORT);
});