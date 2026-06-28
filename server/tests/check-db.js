const db = require('./db');

db.query('DESCRIBE books', (err, result) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Books table structure:');
    console.table(result);
  }
  process.exit();
});
