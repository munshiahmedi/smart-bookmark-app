const http = require('http');

console.log('🎯 Final Wishlist Test with New Admin User...\n');

// Login with new admin user
const postData = JSON.stringify({
  email: 'testadmin@example.com',
  password: 'admin123'
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
      console.log('✅ Login Response:', loginResponse.message);
      
      if (loginResponse.token) {
        console.log('🔑 Got token, testing wishlist...');
        
        // Test 1: Get wishlist (should return 1 item)
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
            console.log('\n📚 Wishlist Test Results:');
            console.log('Status:', wishlistRes.statusCode);
            console.log('Response length:', wishlistData.length);
            
            if (wishlistData.length > 0) {
              try {
                const parsed = JSON.parse(wishlistData);
                console.log('✅ Response type:', typeof parsed);
                console.log('✅ Is array?', Array.isArray(parsed));
                console.log('✅ Array length:', parsed.length);
                
                if (Array.isArray(parsed)) {
                  console.log('📋 Wishlist items:');
                  parsed.forEach((item, index) => {
                    console.log(`${index + 1}. "${item.title}" by ${item.author} (ID: ${item.id})`);
                  });
                  
                  // Test 2: Add book to wishlist
                  console.log('\n➕ Testing Add to Wishlist...');
                  testAddToWishlist(loginResponse.token);
                  
                } else {
                  console.log('❌ Response is not an array:', parsed);
                }
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
      }
    } catch (e) {
      console.error('❌ Login parse error:', e.message);
    }
  });
});

loginReq.on('error', (err) => {
  console.error('❌ Login request error:', err);
});

loginReq.write(postData);
loginReq.end();

function testAddToWishlist(token) {
  const addData = JSON.stringify({ bookId: 6 }); // Add the existing book
  
  const addOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/books/wishlist',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(addData)
    }
  };
  
  const addReq = http.request(addOptions, (addRes) => {
    let addData = '';
    
    addRes.on('data', (chunk) => {
      addData += chunk;
    });
    
    addRes.on('end', () => {
      console.log('Add Status:', addRes.statusCode);
      try {
        const addResponse = JSON.parse(addData);
        console.log('Add Response:', addResponse);
      } catch (e) {
        console.log('Add Raw Response:', addData);
      }
    });
  });
  
  addReq.on('error', (err) => {
    console.error('❌ Add request error:', err);
  });
  
  addReq.write(addData);
  addReq.end();
}
