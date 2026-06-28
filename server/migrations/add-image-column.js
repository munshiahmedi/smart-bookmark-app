const db = require('./db');

const sql = 'ALTER TABLE books ADD COLUMN image VARCHAR(255) DEFAULT NULL';

db.query(sql, (err, result) => {
  if (err) {
    console.log('Column might already exist or error:', err.message);
  } else {
    console.log('Image column added successfully');
  }
  db.end();
});
