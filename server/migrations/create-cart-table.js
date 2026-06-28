const db = require('../db');

const createCartTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      book_id INT,
      quantity INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_book (user_id, book_id)
    )
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error creating cart table:', err);
      return;
    }
    console.log('Cart table created successfully');
  });
};

// Run the migration
createCartTable();

module.exports = createCartTable;
