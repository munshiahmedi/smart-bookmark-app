const http = require('http');

console.log('🧪 Simple Add Book Test...\n');

// Step 1: Login
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

let loginToken = '';

loginReq.on('error', (err) => {
  console.error('❌ Login error:', err);
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
        loginToken = loginResult.token;
        console.log('✅ Logged in successfully');
        
        // Step 2: Test createBook endpoint directly
        testCreateBook(loginToken);
      } else {
        console.log('❌ Login failed:', loginResult);
      }
    } catch (e) {
      console.error('❌ Parse error:', e.message);
    }
  });
});

function testCreateBook(token) {
  console.log('\n🧪 Testing createBook endpoint...');
  
  // Simple test data as JSON
  const bookData = JSON.stringify({
    title: 'Test Book Simple',
    author: 'Test Author',
    description: 'Test Description',
    price: '299',
    status: 'published'
  });
  
  const addReq = http.request({
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
  
  addReq.on('error', (err) => {
    console.error('❌ Add book request error:', err);
  });
  
  addReq.write(bookData);
  addReq.end();
  
  addReq.on('response', (addRes) => {
    let addResponse = '';
    
    addRes.on('data', (chunk) => {
      addResponse += chunk;
    });
    
    addRes.on('end', () => {
      console.log('✅ Create book response status:', addRes.statusCode);
      console.log('Response headers:', addRes.headers);
      
      if (addResponse.length > 0) {
        try {
          const result = JSON.parse(addResponse);
          console.log('✅ Create book result:', result);
          
          if (result.bookId) {
            console.log('🎉 SUCCESS! Book created with ID:', result.bookId);
          } else if (result.error) {
            console.log('❌ Server error:', result.error);
          } else {
            console.log('❌ Unexpected response format:', result);
          }
        } catch (e) {
          console.log('❌ JSON parse error:', e.message);
          console.log('Raw response:', addResponse);
        }
      } else {
        console.log('❌ Empty response from server');
      }
    });
  });
}
