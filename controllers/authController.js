import express from "express"
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"

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

export const loginUser= (req, res) => {
    return res.status(200).json({
        message:"user is logged in"
    })
}