const db = require("../db");

// Migration to add UNIQUE constraint to reviews table
const addUniqueReviewsConstraint = async () => {
  try {
    console.log("Adding UNIQUE constraint to reviews table...");
    
    // Add UNIQUE constraint on (user_id, book_id)
    const sql = `
      ALTER TABLE reviews 
      ADD UNIQUE (user_id, book_id)
    `;
    
    db.query(sql, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log("ERROR: Cannot add UNIQUE constraint - duplicate reviews exist in database");
          console.log("Please clean up duplicate reviews first before running this migration");
        } else if (err.code === 'ER_DUP_KEYNAME') {
          console.log("UNIQUE constraint already exists on reviews table");
        } else {
          console.error("Error adding UNIQUE constraint:", err);
        }
        return;
      }
      
      console.log("UNIQUE constraint added successfully to reviews table");
      console.log("Now users can only add one review per book");
    });
    
  } catch (error) {
    console.error("Migration error:", error);
  }
};

// Run the migration
addUniqueReviewsConstraint();

module.exports = addUniqueReviewsConstraint;
