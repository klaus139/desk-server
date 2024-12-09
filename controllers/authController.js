import express from "express"
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import appTokens from "../config/index.js";

export const registerUser = async (req, res) => {
   const {firstName, lastName, email, phone, password} = req.body; // got input ffrom the user

   //validation of input
   if(!firstName || !lastName || !email || !phone || !password){
    return res.status(400).json({
        message:"please fill all the required fields"
    })
   }

   //check for old users
   const oldUser = await User.findOne({email})
   if(oldUser){
    return res.status(409).json({
        message:"Email already exist"
    })
   }

   const salt = await bcrypt.genSalt()

   //enrypt my password
   const hashedPassword = await bcrypt.hash(password, salt)
   //send email to my user
   //validate

   const newUser = await User.create({
    firstName,
    lastName,
    email,
    password:hashedPassword,
    phone
   })

   return res.status(201).json({
    message:"user created successfully",
    newUser

   })
}

export const loginUser = async (req, res) => {
   //get user input email and password
   const {email, password} = req.body;

   if(!email || !password){
    return res.status(400).json({
        message:"please fill all the required fields"
    })
   }

   //check if the email exist
   const user = await User.findOne({email})
   if(!user){
    return res.status(401).json({
        message:"email or password is incorrect"
    })
   }

   //check if the password is correct
   const isPasswordMatch = await bcrypt.compare(password, user.password )
   if(!isPasswordMatch){
    return res.status(401).json({
        message:"email or password is incorrect"
    })
   }

   //create a token and give exp date
   const accessToken = jwt.sign({userId:user._id}, appTokens.accessTokenSecret,{
    subject:"accessApi",
    expiresIn:appTokens.accessTokenExpiresIn
   })

   return res.status(200).json({
    id:user._id,
    email:user.email,
    firstName:user.firstName,
    lastName:user.lastName,
    accessToken
   })


   //login the user
}