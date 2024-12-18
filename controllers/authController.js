import express from "express"
import {dirname} from "path"
import User from "../models/userModel.js";
import path from "path"
import {fileURLToPath} from "url"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import appTokens from "../config/index.js";
import { createActivationToken } from "../utils/token.js";
import ejs, { Template } from "ejs"
import { mailSent1 } from "../utils/notifications.js";


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

export const createUserWithValidation = async(req, res)=>{
    try{
        const {firstName, lastName, email, password} = req.body;

        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({
                message:"Please fill all the required fields"
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(500).json({
                message:"invalid email"
            })
        }

        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(400).json({
                message:"Email already registered, please login instead"
            })
        }

        const salt = await bcrypt.genSalt(10)

        const hashPassword = await bcrypt.hash(password, salt)

        const {token, activationCode} = createActivationToken({
            firstName, lastName, email, password:hashPassword
        })

        const emailData = {user:{firstName}, activationCode};

        const templatePath = path.join(__dirname, "../mails/activation-mail.ejs");

      
            const html = await ejs.renderFile(templatePath, emailData)
            await User.create({
                firstName, 
                lastName,
                email,
                password:hashPassword
            })

            await mailSent1({
                email,
                subject:"Email verification",
                template:"activation-mail.ejs",
                emailData
            })

            res.status(201).json({
                status:"succss",
                message:`please check your email ${email} to verify your account`,
                activationToken:token,
                activationCode

            })
        

    }catch(error){
        console.log(error)
        return res.status(500).json({
          
            message:"internal server error"
        })
    }
}

export const activateUser = async(req, res) => {
    try{
        const {activation_token, activation_code} = req.body;

        if(!activation_code || !activation_token){
            return res.status(400).json({
                message:"Invalid activation"
            })
        }

        const decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        const {user, activationCode} = decoded;

        if(activationCode !== activation_code){
            return res.status(400).json({
                message:"invalid activation code"
            })
        }

        const userToActivate = await User.findOne({email:user.email})

        if(!userToActivate){
            return res.status(400).json({
                message:"user not found"
            })
        }

        userToActivate.isVerified = true
        
        await userToActivate.save()

        const token = jwt.sign({id:userToActivate._id}, process.env.TOKEN_SECRET)

        res.status(200).json({
            success:true,
            data:{
                user:userToActivate,
                token
            }
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}