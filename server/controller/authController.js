const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");
const login = async(req, res) => {
    const {email, password } = req.body;
    console.log('Login attempt for email:', email);
    console.log('Password provided:', password);
    const sql = "SELECT * FROM users WHERE email = ?";
    
    try {
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [email], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        console.log('User query result:', result.length > 0 ? 'User found' : 'User not found');

        if (result.length === 0) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const user = result[0];
        console.log('User data:', { id: user.id, email: user.email, name: user.name });
        console.log('Stored password hash length:', user.password ? user.password.length : 'none');
        console.log('Comparing password for user:', user.email);

        // Step 2: Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);
        
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1d' } // token expires in 1 day
);
        // Step 3: Login successful
        console.log('Login successful for:', user.email);
        res.send({ 
            message: "Login successful", 
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send({ error: err.message });
    }
};
const register = async (req, res) => {
    try{
        const { name, email, password, confirmPassword } = req.body;
        if(!name || !email || !password || !confirmPassword) {
            return res.status(400).send({message: " All fields are required"});
        }
        if(password !== confirmPassword){
            return res.status(400).send({message: "Passwords do not match"});
        }
        const checkSql = "SELECT * FROM users WHERE email = ?";
        db.query(checkSql, [email], async (err, result) => {
          if (err) return res.status(500).send({ error: err.message });
          if (result.length > 0) {
            return res.status(400).send({ message: "Email already registered" });
          }

          // 4 Hash password
          const hashedPassword = await bcrypt.hash(password, 10);

          // Force role = user for all new signups
          const role = 'user';

          // 5 Insert into DB with role
          const insertSql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
          db.query(insertSql, [name, email, hashedPassword, role], (err, result) => {
            if (err) return res.status(500).send({ error: err.message });

            res.send({ message: "Registration successful" });
          });
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user.id; // Get user ID from token
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).send({ message: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).send({ message: "New passwords do not match" });
        }

        if (newPassword.length < 6) {
            return res.status(400).send({ message: "New password must be at least 6 characters long" });
        }

        if (currentPassword === newPassword) {
            return res.status(400).send({ message: "New password must be different from current password" });
        }

        // Get current user password
        const sql = "SELECT password FROM users WHERE id = ?";
        const result = await new Promise((resolve, reject) => {
            db.query(sql, [userId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result.length === 0) {
            return res.status(404).send({ message: "User not found" });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, result[0].password);
        if (!isMatch) {
            return res.status(401).send({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        const updateSql = "UPDATE users SET password = ? WHERE id = ?";
        await new Promise((resolve, reject) => {
            db.query(updateSql, [hashedPassword, userId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        res.send({ message: "Password changed successfully" });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).send({ error: error.message });
    }
};

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // folder to save uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // unique file name with extension
  }
});

// Filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize upload middleware
const upload = multer({ storage, fileFilter });


module.exports = { login, register, changePassword, upload};