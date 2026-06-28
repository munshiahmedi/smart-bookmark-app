const db = require('../db');

const createReviewsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      book_id INT NOT NULL,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      UNIQUE KEY unique_review (user_id, book_id)
    )
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error creating reviews table:', err);
      return;
    }
    console.log('✅ Reviews table created successfully');
    console.log('Table structure:');
    console.log('- id: INT AUTO_INCREMENT PRIMARY KEY');
    console.log('- user_id: INT (Foreign Key to users)');
    console.log('- book_id: INT (Foreign Key to books)');
    console.log('- rating: INT (1-5, with validation)');
    console.log('- comment: TEXT');
    console.log('- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    console.log('- Unique constraint: One user can review one book only');
    process.exit(0);
  });
};

createReviewsTable();
