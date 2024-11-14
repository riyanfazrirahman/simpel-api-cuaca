const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY; // Ganti dengan API key kamu

app.get("/weather", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat: req.query.lat,
          lon: req.query.lon,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = response.data;

    // Ambil data yang diperlukan
    const weatherInfo = {
      location: data.name, // Nama lokasi
      weather: data.weather[0].main, // Cuaca (misal: Clear, Rain, Cloud)
      description: data.weather[0].description, // Deskripsi cuaca
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`, // URL untuk ikon cuaca
      temperature: data.main.temp, // Suhu dalam Celsius
      cloudiness: data.clouds.all, // Persentase awan
    };

    res.json(weatherInfo); // Mengirimkan data cuaca sebagai respons
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
