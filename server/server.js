const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require('path');

const app = express();

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const userRoutes = require('./routes/routes');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes)

// Test route to verify books routes are loaded
app.get("/api/test-books", (req, res) => {
    res.json({ message: "Books routes test endpoint working" });
});

app.use("/api/user", userRoutes);
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});