const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Test the exact same request structure as the frontend
console.log('=== Testing Frontend Request Structure ===\n');

// Create a test image file
const testImagePath = path.join(__dirname, 'test-frontend-image.png');
const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
fs.writeFileSync(testImagePath, testImageBuffer);

console.log('1. Created test image file');

// Generate JWT token (same as frontend would use)
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production';
const testUser = { id: 2, email: 'admin@example.com' };
const token = jwt.sign(testUser, JWT_SECRET);

console.log('2. Generated JWT token for user ID:', testUser.id);

// Prepare form data exactly like the frontend
const formData = new FormData();
formData.append('title', 'Frontend Test Book');
formData.append('author', 'Frontend Test Author');
formData.append('description', 'This is a test book from frontend simulation');
formData.append('price', '199.99');
formData.append('status', 'draft');
formData.append('image', fs.createReadStream(testImagePath), {
  filename: 'test-frontend-image.png',
  contentType: 'image/png'
});

console.log('3. Prepared form data (exactly like frontend)');

// Make the API call WITHOUT setting Content-Type (the fix)
const apiUrl = 'http://localhost:5000/api/books';

console.log('4. Making API call (WITHOUT manual Content-Type header):');
console.log('   URL:', apiUrl);
console.log('   Authorization: Bearer <token>');
console.log('   Content-Type: NOT set (let Axios handle it)');

axios.post(apiUrl, formData, {
  headers: {
    'Authorization': `Bearer ${token}`
    // Note: NO Content-Type header - letting Axios set it automatically
  },
  timeout: 10000
})
.then(response => {
  console.log('5. SUCCESS! Book created with fixed headers:');
  console.log('   Status:', response.status);
  console.log('   Response:', response.data);
  
  // Clean up
  fs.unlinkSync(testImagePath);
  console.log('6. Cleaned up test image');
})
.catch(error => {
  console.error('5. ERROR! Request failed:');
  
  if (error.response) {
    console.error('   Status:', error.response.status);
    console.error('   Response:', error.response.data);
  } else if (error.request) {
    console.error('   No response received:', error.message);
  } else {
    console.error('   Error message:', error.message);
  }
  
  // Clean up
  try {
    fs.unlinkSync(testImagePath);
    console.log('6. Cleaned up test image');
  } catch (cleanupError) {
    console.error('   Failed to clean up:', cleanupError.message);
  }
});
