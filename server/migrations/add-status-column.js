const db = require('./db');

const sql = "ALTER TABLE books ADD COLUMN status ENUM('draft','published') DEFAULT 'draft'";

db.query(sql, (err, result) => {
  if (err) {
    console.log('Column might already exist or error:', err.message);
  } else {
    console.log('Status column added successfully');
  }
  
  // Check table structure
  db.query('DESCRIBE books', (err, result) => {
    if (err) {
      console.error('Error describing table:', err);
    } else {
      console.log('\n📋 Books table structure:');
      result.forEach(column => {
        console.log(`  - ${column.Field}: ${column.Type} ${column.Default ? `(Default: ${column.Default})` : ''}`);
      });
    }
    
    db.end();
  });
});
