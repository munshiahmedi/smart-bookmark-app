const db = require('./db');

const addTimestamps = () => {
    const tables = ['books', 'users'];
    
    tables.forEach((table, index) => {
        // Check if column exists first
        const checkSql = `SHOW COLUMNS FROM ${table} LIKE 'created_at'`;
        
        db.query(checkSql, (err, result) => {
            if (err) {
                console.log(`Check ${table} error:`, err.message);
            } else if (result.length === 0) {
                // Column doesn't exist, add it
                const addSql = `ALTER TABLE ${table} ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
                db.query(addSql, (addErr, addResult) => {
                    if (addErr) {
                        console.log(`Add ${table} error:`, addErr.message);
                    } else {
                        console.log(`Added created_at to ${table} successfully`);
                    }
                    
                    if (index === tables.length - 1) {
                        db.end();
                        console.log('Timestamp columns setup completed');
                    }
                });
            } else {
                console.log(`created_at already exists in ${table}`);
                
                if (index === tables.length - 1) {
                    db.end();
                    console.log('Timestamp columns setup completed');
                }
            }
        });
    });
};

addTimestamps();
