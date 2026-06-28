const http = require('http');

console.log('🧪 Testing Create Book Endpoint Directly...\n');

// Step 1: Login first
const loginData = JSON.stringify({
  email: 'adil@gmail.com', // Use existing admin
  password: '123456' // Try common password
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
  console.error('❌ Login error:', err.message);
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
        console.log('✅ Login successful, testing create book...');
        
        // Step 2: Test create book with minimal data
        const bookData = JSON.stringify({
          title: 'Test Book Direct',
          author: 'Test Author',
          description: 'Test Description',
          price: '299',
          status: 'published'
        });
        
        const createReq = http.request({
          hostname: 'localhost',
          port: 5000,
          path: '/api/books',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(bookData)
          }
        });
        
        createReq.on('error', (err) => {
          console.error('❌ Create book request error:', err.message);
        });
        
        createReq.write(bookData);
        createReq.end();
        
        createReq.on('response', (createRes) => {
          let createResponse = '';
          
          createRes.on('data', (chunk) => {
            createResponse += chunk;
          });
          
          createRes.on('end', () => {
            console.log('\n📝 Create Book Response:');
            console.log('Status:', createRes.statusCode);
            console.log('Headers:', createRes.headers);
            
            if (createResponse.length > 0) {
              try {
                const result = JSON.parse(createResponse);
                console.log('✅ Result:', result);
                
                if (result.bookId) {
                  console.log('🎉 SUCCESS! Book created with ID:', result.bookId);
                  console.log('💡 Create Book endpoint is working!');
                } else if (result.error) {
                  console.log('❌ Server error:', result.error);
                } else {
                  console.log('❌ Unexpected response format:', result);
                }
              } catch (e) {
                console.log('❌ JSON parse error:', e.message);
                console.log('Raw response:', createResponse);
              }
            } else {
              console.log('❌ Empty response from server');
            }
          });
        });
      } else {
        console.log('❌ Login failed:', loginResult);
      }
    } catch (e) {
      console.error('❌ Login parse error:', e.message);
    }
  });
});
