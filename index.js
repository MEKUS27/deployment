const http = require("http");
const url = require("url");
const axios = require("axios");


async function makeApiCall(location) {
  const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=ccfebbb910404ae5bc5101334240107&q=${location}&days=1&aqi=no&alerts=no`;
  const response = await axios.get(apiUrl);
  return response.data;
}


const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/hello")) {
    try {
      const queryParams = url.parse(req.url, true).query;
      const location = queryParams.location || 'London'; 
      const apiResponse = await makeApiCall(location);

      
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      res.writeHead(200, { "Content-Type": "application/json" });
      const data = {
        client_ip: ip, 
        location: apiResponse.location.region, 
        greeting: `Hello, ${
          queryParams.visitor_name
            ? queryParams.visitor_name
            : "Enter your name with params ?visitor_name=your_name"
        }!, the temperature is ${
          apiResponse.current.temp_c
        } degrees Celsius in ${apiResponse.location.region}`,
      };

      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error calling API");
    }
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome to my simple Node.js app!");
  }
});

const port = 3000;

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
