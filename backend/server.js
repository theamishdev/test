const express = require('express');
const cors = require('cors');
const os = require('os');
const limiter = require('./middleware/rateLimiter');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SERVER_ID = process.env.SERVER_ID || os.hostname();

app.use(cors());
app.use(express.json());



// Main endpoint
app.get('/api/status', limiter, (req, res) => {
  res.json({
    message: "Connected to Backend",
    serverID: SERVER_ID,
    timestamp: new Date().toISOString(),
    environment: "Local Development",
    rateLimit: "10 requests per minute"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with ID: ${SERVER_ID}`);
});
