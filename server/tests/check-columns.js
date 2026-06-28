const db = require('./db');

db.query('DESCRIBE books', (err, result) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Books table columns:');
    result.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type}`);
    });
  }
  process.exit();
});
