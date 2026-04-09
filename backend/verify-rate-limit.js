const http = require('http');

async function testRateLimit() {
  console.log("Starting Rate Limit Test (12 requests)...");
  
  for (let i = 1; i <= 12; i++) {
    await new Promise((resolve) => {
      http.get('http://localhost:5000/api/status', (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          console.log(`Request ${i}: Status ${res.statusCode} - ${data.substring(0, 50)}...`);
          resolve();
        });
      }).on('error', (err) => {
        console.error(`Request ${i}: Error - ${err.message}`);
        resolve();
      });
    });
  }
}

testRateLimit();
