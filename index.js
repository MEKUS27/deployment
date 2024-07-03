import express from "express";
import axios from "axios";
import dotenv from "dotenv"
// const express = require('express');
// const axios = require('axios');
// require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  
  const geoResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
  const location = geoResponse.data.city || 'Unknown location';

 
  const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`);
  const temperature = weatherResponse.data.main.temp;

  res.json({
    client_ip: clientIp,
    location: location,
    greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
  });
}); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
