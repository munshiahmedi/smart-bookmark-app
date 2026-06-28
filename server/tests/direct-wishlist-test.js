const http = require('http');

console.log('🔍 Direct Wishlist Route Test...\n');

// Create a simple request to test the route
const postData = JSON.stringify({
  email: 'adil@gmail.com',
  password: '123456'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const loginReq = http.request(loginOptions, (loginRes) => {
  let loginData = '';
  
  loginRes.on('data', (chunk) => {
    loginData += chunk;
  });
  
  loginRes.on('end', () => {
    try {
      const loginResponse = JSON.parse(loginData);
      console.log('✅ Login Status:', loginRes.statusCode);
      
      if (loginResponse.token) {
        console.log('🔑 Got token, testing wishlist...');
        
        // Now test wishlist
        const wishlistOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/books/wishlist',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginResponse.token}`,
            'Content-Type': 'application/json'
          }
        };
        
        const wishlistReq = http.request(wishlistOptions, (wishlistRes) => {
          let wishlistData = '';
          
          wishlistRes.on('data', (chunk) => {
            wishlistData += chunk;
          });
          
          wishlistRes.on('end', () => {
            console.log('✅ Wishlist Status:', wishlistRes.statusCode);
            console.log('Response headers:', wishlistRes.headers);
            console.log('Raw response length:', wishlistData.length);
            
            if (wishlistData.length > 0) {
              try {
                const parsed = JSON.parse(wishlistData);
                console.log('✅ Parsed response type:', typeof parsed);
                console.log('✅ Is array?', Array.isArray(parsed));
                console.log('✅ Response:', parsed);
              } catch (e) {
                console.log('❌ JSON parse error:', e.message);
                console.log('Raw response:', wishlistData);
              }
            } else {
              console.log('❌ Empty response from wishlist API');
            }
          });
        });
        
        wishlistReq.on('error', (err) => {
          console.error('❌ Wishlist request error:', err);
        });
        
        wishlistReq.end();
      } else {
        console.log('❌ Login failed:', loginResponse);
      }
    } catch (e) {
      console.error('❌ Login parse error:', e.message);
      console.log('Raw login response:', loginData);
    }
  });
});

loginReq.on('error', (err) => {
  console.error('❌ Login request error:', err);
});

loginReq.write(postData);
loginReq.end();
