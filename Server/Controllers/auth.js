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
    }
    catch(error){
        res.status(500).json({message: error.message});
    }};