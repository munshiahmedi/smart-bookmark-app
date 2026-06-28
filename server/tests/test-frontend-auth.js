const http = require('http');

console.log('🔍 Testing Frontend Authentication Flow...\n');

// Test 1: Try login with correct credentials
const loginData = JSON.stringify({
  email: 'testadmin@example.com',
  password: 'admin123'
});

const loginReq = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
});

let authToken = '';

loginReq.on('error', (err) => {
  console.error('❌ Login request error:', err);
});

loginReq.write(loginData);
loginReq.end();

loginReq.on('response', (loginRes) => {
  let loginResponse = '';
  
  loginRes.on('data', (chunk) => {
    loginResponse += chunk;
  });
  
  loginRes.on('end', () => {
    try {
      const loginResult = JSON.parse(loginResponse);
      if (loginResult.token) {
        authToken = loginResult.token;
        console.log('✅ Login successful!');
        console.log('Token:', authToken.substring(0, 50) + '...');
        
        // Test 2: Try to access a protected route with the token
        testProtectedRoute(authToken);
        
        // Test 3: Try to create book with the token
        testCreateBookWithToken(authToken);
        
      } else {
        console.log('❌ Login failed:', loginResult);
      }
    } catch (e) {
      console.error('❌ Login parse error:', e.message);
    }
  });
});

function testProtectedRoute(token) {
  console.log('\n🧪 Testing protected route access...');
  
  const testReq = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/books/my-books', // This route requires authentication
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  testReq.on('error', (err) => {
    console.error('❌ Protected route error:', err);
  });
  
  testReq.end();
  
  testReq.on('response', (testRes) => {
    let testResponse = '';
    
    testRes.on('data', (chunk) => {
      testResponse += chunk;
    });
    
    testRes.on('end', () => {
      try {
        const result = JSON.parse(testResponse);
        console.log('Protected route status:', testRes.statusCode);
        
        if (testRes.statusCode === 200) {
          console.log('✅ Protected route access successful');
        } else {
          console.log('❌ Protected route access failed');
        }
      } catch (e) {
        console.log('❌ Response parse error:', e.message);
      }
    });
  });
}

function testCreateBookWithToken(token) {
  console.log('\n📚 Testing create book with token...');
  
  const bookData = JSON.stringify({
    title: 'Auth Test Book',
    author: 'Auth Test Author',
    description: 'Testing auth flow',
    price: '299',
    status: 'published'
  });
  
  const createReq = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/books',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bookData)
    }
  });
  
  createReq.on('error', (err) => {
    console.error('❌ Create book request error:', err);
  });
  
  createReq.write(bookData);
  createReq.end();
  
  createReq.on('response', (createRes) => {
    let createResponse = '';
    
    createRes.on('data', (chunk) => {
      createResponse += chunk;
    });
    
    createRes.on('end', () => {
      console.log('Create book status:', createRes.statusCode);
      
      if (createResponse.length > 0) {
        try {
          const result = JSON.parse(createResponse);
          console.log('Create book result:', result);
          
          if (result.bookId) {
            console.log('🎉 SUCCESS! Book created with token');
          } else if (result.error) {
            console.log('❌ Create book error:', result.error);
          } else {
            console.log('❌ Unexpected response:', result);
          }
        } catch (e) {
          console.log('❌ JSON parse error:', e.message);
          console.log('Raw response:', createResponse);
        }
      } else {
        console.log('❌ Empty response from create book');
      }
    });
  });
}

console.log('\n💡 Instructions:');
console.log('1. If this test works, the issue is in the frontend React app');
console.log('2. If this test fails, the issue is in the backend');
console.log('3. Check browser console for JavaScript errors');
console.log('4. Make sure you are logged in with correct credentials in the browser');
