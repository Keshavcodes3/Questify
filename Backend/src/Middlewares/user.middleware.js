import jwt from "jsonwebtoken";
import User from "../Models/user.model.js"

export const authUser = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            error: "No token found",
            success: false
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            error: err.message
        });
    }
};