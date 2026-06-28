const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);
    if(!authHeader){
        return res.status(403).send("no token provided");
    }
    const token = authHeader.split(' ')[1]; // Extract token from "Bearer token"
    console.log('Token:', token);
    if(!token){
        return res.status(403).send("token format invalid");
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        console.log('Decoded:', decoded);
        if(err){
            console.log('JWT error:', err);
            return res.status(500).send("failed to authenticate token");
        }
        req.userid = decoded.id;
        req.userRole = decoded.role || 'user'; // Default to 'user' if no role
        console.log('Set req.userid to:', req.userid);
        console.log('Set req.userRole to:', req.userRole);
        next();
    });
}
const verifyAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
module.exports = { verifyToken, verifyAdmin };