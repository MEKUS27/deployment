const express = require('express');
const axios = require('axios');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 3000;

async function getWeather(ip) {
  const url = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${ip}&aqi=no`;
  const response = await axios.get(url);
  return response.data;
}

app.get('/api/hello', async (req, res) => {
  try {
    const queryParams = req.query;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const weatherData = await getWeather(ip);

    const data = {
      client_ip: ip,
      location: weatherData.location.name,
      greeting: `Hello, ${
        queryParams.visitor_name
          ? queryParams.visitor_name
          : 'Enter your name with params ?visitor_name=your_name'
      }!, the temperature is ${weatherData.current.temp_c} degrees Celsius in ${weatherData.location.name}`,
    };

    res.json(data);
  } catch (error) {
    res.status(500).send('Error calling API');
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to my simple Node.js app!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
