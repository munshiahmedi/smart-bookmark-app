const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Test the BROKEN request structure (original frontend issue)
console.log('=== Testing BROKEN Request Structure (with manual Content-Type) ===\n');

// Create a test image file
const testImagePath = path.join(__dirname, 'test-broken-image.png');
const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
fs.writeFileSync(testImagePath, testImageBuffer);

console.log('1. Created test image file');

// Generate JWT token
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production';
const testUser = { id: 2, email: 'admin@example.com' };
const token = jwt.sign(testUser, JWT_SECRET);

console.log('2. Generated JWT token for user ID:', testUser.id);

// Prepare form data
const formData = new FormData();
formData.append('title', 'Broken Test Book');
formData.append('author', 'Broken Test Author');
formData.append('description', 'This should fail with manual Content-Type');
formData.append('price', '299.99');
formData.append('status', 'draft');
formData.append('image', fs.createReadStream(testImagePath), {
  filename: 'test-broken-image.png',
  contentType: 'image/png'
});

console.log('3. Prepared form data');

// Make the API call WITH manual Content-Type (the original problem)
const apiUrl = 'http://localhost:5000/api/books';

console.log('4. Making BROKEN API call (WITH manual Content-Type header):');
console.log('   URL:', apiUrl);
console.log('   Authorization: Bearer <token>');
console.log('   Content-Type: multipart/form-data (MANUALLY SET - THIS CAUSES THE ERROR)');

axios.post(apiUrl, formData, {
  headers: {
    'Content-Type': 'multipart/form-data', // THIS IS THE PROBLEM!
    'Authorization': `Bearer ${token}`
  },
  timeout: 10000
})
.then(response => {
  console.log('5. UNEXPECTED SUCCESS! This should have failed...');
  console.log('   Status:', response.status);
  console.log('   Response:', response.data);
  
  fs.unlinkSync(testImagePath);
  console.log('6. Cleaned up test image');
})
.catch(error => {
  console.log('5. EXPECTED ERROR! This demonstrates the original problem:');
  
  if (error.response) {
    console.error('   Status:', error.response.status);
    console.error('   Response:', error.response.data);
    console.error('   This is the 500 error the frontend was getting!');
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
