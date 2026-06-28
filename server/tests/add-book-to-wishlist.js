const axios = require('axios');

console.log('🧪 Adding Book to Wishlist via API...\n');

// Login first
axios.post('http://localhost:5000/api/auth/login', {
  email: 'testadmin@example.com',
  password: 'admin123'
})
.then(loginRes => {
  console.log('✅ Logged in successfully');
  
  // Add book 6 to wishlist
  return axios.post('http://localhost:5000/api/books/wishlist', 
    { bookId: 6 }, // "unique story" book
    {
      headers: { 
        'Authorization': `Bearer ${loginRes.data.token}`,
        'Content-Type': 'application/json'
      }
    }
  );
})
.then(addRes => {
  console.log('✅ Add to wishlist response:');
  console.log('Status:', addRes.status);
  console.log('Data:', addRes.data);
  
  // Now get wishlist to verify
  return axios.get('http://localhost:5000/api/books/wishlist', {
    headers: { 
      'Authorization': `Bearer ${loginRes.data.token}`,
      'Content-Type': 'application/json'
    }
  });
})
.then(getRes => {
  console.log('\n📚 Wishlist after adding:');
  console.log('Status:', getRes.status);
  console.log('Items:', getRes.data.length);
  
  if (Array.isArray(getRes.data) && getRes.data.length > 0) {
    getRes.data.forEach((item, index) => {
      console.log(`${index + 1}. "${item.title}" (ID: ${item.id})`);
    });
    
    console.log('\n🎉 Wishlist feature is working perfectly!');
    console.log('💡 You can now test this in the frontend:');
    console.log('1. Login with testadmin@example.com / admin123');
    console.log('2. Go to Books page - you should see ❤️ button');
    console.log('3. Click ❤️ to save book to wishlist');
    console.log('4. Check Wishlist page to see saved books');
  } else {
    console.log('❌ Wishlist still not working');
  }
})
.catch(err => {
  console.error('❌ Error:', err.response?.status, err.response?.data);
});
