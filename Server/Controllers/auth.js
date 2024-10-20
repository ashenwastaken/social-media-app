import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

export const register = async (req, res) => {
    try{
        const {
            firstName, 
            lastName, 
            email, 
            password, 
            picturePath, 
            friends, 
            location, 
            occupation} = req.body;
        const salt = bcrypt.genSaltSync();
        const passwordHash = bcrypt.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName, 
            email, 
            password: passwordHash, 
            picturePath, 
            friends, 
            location, 
            occupation, 
            viewedProfile: Math.floor(Math.random() * 10000), 
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }};

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: "User ddoes not exist"});
        const isPasswordCorrect = bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.status(200).json({result: user, token});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}