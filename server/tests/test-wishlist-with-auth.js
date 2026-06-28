const http = require('http');
const jwt = require('jsonwebtoken');

console.log('🔍 Testing Wishlist API with Authentication...\n');

// First, create a test token (simulating logged-in user)
const testToken = jwt.sign(
  { id: 2, email: 'adil@gmail.com', role: 'admin' },
  'your_jwt_secret_here', // This should match your JWT_SECRET
  { expiresIn: '1d' }
);

console.log('🔑 Generated test token for user ID 2 (admin)');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/books/wishlist',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${testToken}`
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
      console.log('Response Length:', response.length);
      
      if (Array.isArray(response)) {
        console.log('\n✅ Success! Wishlist API returned an array:');
        response.forEach((item, index) => {
          console.log(`${index + 1}. Book ID: ${item.id}, Title: "${item.title}"`);
        });
      } else {
        console.log('\n❌ Response is not an array:');
        console.log(response);
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
