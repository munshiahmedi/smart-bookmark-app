const axios = require('axios');

console.log('🌐 Testing Wishlist API like Frontend...\n');

// Simulate frontend login first to get a real token
axios.post('http://localhost:5000/api/auth/login', {
  email: 'adil@gmail.com',
  password: '123456' // Common test password
})
.then(loginRes => {
  console.log('✅ Login successful!');
  console.log('Token:', loginRes.data.token.substring(0, 50) + '...');
  
  // Now test wishlist API with real token
  return axios.get('http://localhost:5000/api/books/wishlist', {
    headers: { 
      'Authorization': `Bearer ${loginRes.data.token}`,
      'Content-Type': 'application/json'
    }
  });
})
.then(wishlistRes => {
  console.log('✅ Wishlist API Response!');
  console.log('Status:', wishlistRes.status);
  console.log('Data type:', typeof wishlistRes.data);
  console.log('Is array?', Array.isArray(wishlistRes.data));
  console.log('Data length:', wishlistRes.data.length);
  
  if (Array.isArray(wishlistRes.data)) {
    console.log('📚 Wishlist items:');
    wishlistRes.data.forEach((item, index) => {
      console.log(`${index + 1}. "${item.title}" (ID: ${item.id})`);
    });
  } else {
    console.log('❌ Response is not an array:');
    console.log(wishlistRes.data);
  }
})
.catch(err => {
  console.error('❌ Error:', err.response?.status, err.response?.data);
  if (err.response?.status === 500) {
    console.log('🔍 Server error - check server logs');
  }
});
