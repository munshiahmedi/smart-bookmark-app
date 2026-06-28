const db = require('./db');

db.query('SHOW TABLES LIKE "wishlist"', (err, result) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  console.log('Wishlist table result:', result);
  if (result.length === 0) {
    console.log('Wishlist table does not exist');
  } else {
    console.log('Wishlist table exists');
  }
  process.exit(0);
});
