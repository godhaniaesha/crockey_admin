const jwt = require('jsonwebtoken');
const Register = require('../model/register.model');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    console.log('Token:', token);
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        console.log('decoded',decoded);
        
        const user = await Register.findById(decoded._id);
        if (!user) return res.status(401).json({ error: 'User not found' });
        req.user = { _id: user._id, role: user.role };
        console.log(req.user, 'req.user');

        next();
    } catch (err) {
        console.error('JWT error:', err);
        return res.status(401).json({ error: 'Invalid token' });
    }
};
module.exports = authenticate;