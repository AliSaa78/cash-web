import {} from 'dotenv/config';
import jwt from "jsonwebtoken";
import User from '../model/userModel.js';
const secretKey = process.env.SECRET_TOKEN;
const protect =  async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization || req.headers.Authorization;
            if (!authHeader) {
                return res.status(403).json({ message: "Token is not provided" });
            }
            const token = authHeader.split(' ')[1];
            jwt.verify(token, secretKey, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid Token" });
                }
                console.log(decoded);
                req.user = await User.findById(decoded.id).select('-password');
                if (!req.user) {
                    return res.status(404).json({ message: "User not found" });
                }
                next();
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Server error');;
        }
        
    }


    export default protect;