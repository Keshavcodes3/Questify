import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../Models/user.model.js";
import habitModel from "../Models/habit.model.js";
export const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                level: user.level,
                xp: user.xp
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Register failed",
            error: error.message
        });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                level: user.level,
                xp: user.xp
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};


export const getMe = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to fetch user"
        });
    }
};



export const updateProfileController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body
        if (!name && !email) {
            return res.status(400).json({
                message: "Name or email must have a value to update",
                error: "must provide a value to update",
                success: false
            })
        }
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (name) user.name = name;
        if (email) user.email = email
        await user.save()
        return res.status(200).json({
            message: "Profile updated successfully",
            error: null,
            user: user,
            success: false
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to fetch user"
        });
    }
}



export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId).select("+xp +badges +coins +level ")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "User Status fetched successfully",
            userStats: user,
            error: null,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to fetch user"
        });
    }
}


