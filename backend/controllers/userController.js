import User from '../models/userModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ||  'your_jwt_secreat_here';
const TOKEN_EXPIRES = '24h';

const createToken = (userId) => jwt.sign({id:userId}, JWT_SECRET,{expiresIn: TOKEN_EXPIRES});
//Register

export async function registerUser(req,res) {
    const {name, email, password} = req.body;

    // Enhanced validation
    if(!name || !email || !password) {
        return res.status(400).json({success: false, message: "All fields are required"});
    }
    
    if(name.trim().length < 2) {
        return res.status(400).json({success: false, message: "Name must be at least 2 characters"});
    }
    
    if(name.trim().length > 50) {
        return res.status(400).json({success: false, message: "Name cannot exceed 50 characters"});
    }
    
    if(!validator.isEmail(email)) {
        return res.status(400).json({success: false, message: "Invalid email format"});
    }
    
    if(password.length < 8) {
        return res.status(400).json({success: false, message: "Password must be at least 8 characters"});
    }
    
    if(password.length > 128) {
        return res.status(400).json({success: false, message: "Password cannot exceed 128 characters"});
    }
    
    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if(!passwordRegex.test(password)) {
        return res.status(400).json({success: false, message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"});
    }
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ success: false, message: "Email already registered" });
        }
        const hashed = await bcrypt.hash(password,10);
        const user = await User.create({name: name.trim(), email: email.toLowerCase(), password: hashed});
        const token = createToken(user._id)
        
        res.status(201).json({success: true, token, user: {id: user._id, name:user.name, email: user.email}});
    } 
    
    catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server error"});
    }
}

//Login 
export async function loginUser(req,res) {
    const {email,password} = req.body;
    
    // Enhanced validation
    if(!email || !password) {
        return res.status(400).json({success: false, message: "Email and password are required"});
    }
    
    if(!validator.isEmail(email)) {
        return res.status(400).json({success: false, message: "Invalid email format"});
    }
    
    if(password.length < 8) {
        return res.status(400).json({success: false, message: "Password must be at least 8 characters"});
    }

    try {
        const user = await User.findOne({email: email.toLowerCase()});
        if(!user) {
            return res.status(401).json({success: false, message: "Invalid credentials"});
        }
        const match = await bcrypt.compare(password,user.password);

        if(!match) {
            return res.status(401).json({success: false, message: "Invalid credentials"})
        }
        const token = createToken(user._id);
        res.json({success: true, token, user: {id: user._id,name: user.name , email: user.email}});
    }

    catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server error"});
    }
}

//Get current User function

export async function getCurretUser(req,res) {
    try {
        const user = await User.findById(req.user.id).select("name email");
        if (!user) {
            return res.status(400).json({success:false, message:"User not found"});
        }
        // Add id to the response
        res.json({success: true , user: { id: user._id, name: user.name, email: user.email }})
    }
     catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server error"});
    }
}

//Update user Profile
export async function updateProfile(req, res) {
    const {name, email} = req.body;

    // Enhanced validation
    if(!name || !email) {
        return res.status(400).json({success: false, message: "Name and email are required"});
    }
    
    if(name.trim().length < 2) {
        return res.status(400).json({success: false, message: "Name must be at least 2 characters"});
    }
    
    if(name.trim().length > 50) {
        return res.status(400).json({success: false, message: "Name cannot exceed 50 characters"});
    }
    
    if(!validator.isEmail(email)) {
        return res.status(400).json({success: false, message: "Invalid email format"});
    }

    try {
        const exists = await User.findOne({email: email.toLowerCase(), _id: { $ne: req.user.id}});

        if(exists) {
            return res.status(409).json({success: false, message: "Email already used by another account"});
        }
        const user = await User.findByIdAndUpdate (
            req.user.id,
            {name: name.trim(), email: email.toLowerCase()},
            {new: true, runValidators:true, select: "name email"}
        );
        res.json({success: true, user})

    } 
    catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server error"});
    }
}

//change password 
export async function Updatepassword(req,res) {
    const {currentPassword, newPassword} = req.body;

    // Enhanced validation
    if(!currentPassword || !newPassword) {
        return res.status(400).json({success: false, message: "Current password and new password are required"});
    }
    
    if(newPassword.length < 8) {
        return res.status(400).json({success: false, message: "New password must be at least 8 characters"});
    }
    
    if(newPassword.length > 128) {
        return res.status(400).json({success: false, message: "Password cannot exceed 128 characters"});
    }
    
    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if(!passwordRegex.test(newPassword)) {
        return res.status(400).json({success: false, message: "New password must contain at least one uppercase letter, one lowercase letter, and one number"});
    }
    
    if(currentPassword === newPassword) {
        return res.status(400).json({success: false, message: "New password must be different from current password"});
    }
    
    try {
        const user = await User.findById(req.user.id).select("password");
        if(!user) {
            return res.status(404).json({success: false, message :"User not found"});
        }
        const match = await bcrypt.compare(currentPassword,user.password);
        if(!match) {
            return res.status(401).json({success: false, message: "Current password incorrect"});
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({success: true, message :"Password changed successfully"});
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server error"});
    }
}