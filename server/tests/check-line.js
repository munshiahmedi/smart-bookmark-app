const fs = require('fs');
const content = fs.readFileSync('controller/bookController.js', 'utf8');
const lines = content.split('\n');
console.log('Line 169:', lines[168]);
console.log('Line 170:', lines[169]);
console.log('Line 171:', lines[170]);
