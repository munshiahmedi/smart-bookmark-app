const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const jwt = require('jsonwebtoken');

console.log('=== Simple Upload Test ===\n');

// Generate valid token
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production';
const token = jwt.sign({ id: 2, email: 'admin@example.com' }, JWT_SECRET);

// Test 1: Valid PNG
console.log('1. Testing valid PNG:');
const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const pngPath = path.join(__dirname, 'simple-test.png');
fs.writeFileSync(pngPath, pngBuffer);

const formData = new FormData();
formData.append('title', 'Simple Test');
formData.append('author', 'Simple Author');
formData.append('description', 'Simple test');
formData.append('price', '99.99');
formData.append('status', 'draft');
formData.append('image', fs.createReadStream(pngPath), {
  filename: 'simple-test.png',
  contentType: 'image/png'
});

axios.post('http://localhost:5000/api/books', formData, {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  timeout: 5000
})
.then(response => {
  console.log('SUCCESS:', response.status, response.data);
})
.catch(error => {
  console.log('ERROR:', error.message);
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Data:', error.response.data);
  }
})
.finally(() => {
  try { fs.unlinkSync(pngPath); } catch (e) {}
});
