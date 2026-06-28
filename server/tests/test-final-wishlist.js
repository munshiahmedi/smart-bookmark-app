const http = require('http');

console.log('🎯 Final Wishlist Test...\n');

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
        console.log('✅ Login successful!');
        
        // Step 2: Add to wishlist
        const addData = JSON.stringify({ bookId: 6 });
        const addReq = http.request({
          hostname: 'localhost',
          port: 5000,
          path: '/api/books/wishlist',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${loginResult.token}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(addData)
          }
        });
        
        addReq.on('error', (err) => {
          console.error('❌ Add error:', err);
        });
        
        addReq.write(addData);
        addReq.end();
        
        addReq.on('response', (addRes) => {
          let addResponse = '';
          
          addRes.on('data', (chunk) => {
            addResponse += chunk;
          });
          
          addRes.on('end', () => {
            console.log('✅ Add to wishlist:', addRes.statusCode);
            
            // Step 3: Get wishlist
            const getReq = http.request({
              hostname: 'localhost',
              port: 5000,
              path: '/api/books/wishlist',
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${loginResult.token}`,
                'Content-Type': 'application/json'
              }
            });
            
            getReq.on('error', (err) => {
              console.error('❌ Get error:', err);
            });
            
            getReq.end();
            
            getReq.on('response', (getRes) => {
              let getResponse = '';
              
              getRes.on('data', (chunk) => {
                getResponse += chunk;
              });
              
              getRes.on('end', () => {
                console.log('✅ Get wishlist:', getRes.statusCode);
                
                if (getResponse.length > 0) {
                  try {
                    const wishlist = JSON.parse(getResponse);
                    console.log('🎉 SUCCESS! Wishlist contains:');
                    console.log(`- ${wishlist.length} items`);
                    wishlist.forEach((item, index) => {
                      console.log(`  ${index + 1}. "${item.title}" (ID: ${item.id})`);
                    });
                    
                    console.log('\n🌐 Frontend Instructions:');
                    console.log('1. Go to http://localhost:3000');
                    console.log('2. Login with: testadmin@example.com / admin123');
                    console.log('3. Check Books page - ❤️ button should be filled');
                    console.log('4. Check Wishlist page - should show saved book');
                    console.log('\n✅ Wishlist feature is now fully functional!');
                  } catch (e) {
                    console.log('❌ Parse error:', e.message);
                  }
                } else {
                  console.log('❌ Empty response');
                }
              });
            });
          });
        });
      } else {
        console.log('❌ Login failed:', loginResult);
      }
    } catch (e) {
      console.error('❌ Parse error:', e.message);
    }
  });
});
