const http = require('http');

console.log('🔍 Testing Wishlist API...\n');

// First, let's test without authentication
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/books/wishlist',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✅ API Response Status:', res.statusCode);
    console.log('Response Headers:', res.headers);
    
    try {
      const response = JSON.parse(data);
      console.log('Response Type:', typeof response);
      console.log('Is Array?', Array.isArray(response));
      console.log('Response:', response);
      
      if (typeof response === 'object' && !Array.isArray(response)) {
        console.log('\n❌ Response is an object, not an array!');
        console.log('This is why .map() is failing on frontend.');
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
});

req.end();
