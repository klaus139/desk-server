import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import ErrorResponse from "../utils/appError.js"

export const verifyUser = async(req,res,next)=>{
    let token;
    if(req.headers.authorization){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return res.status(400).json({
            message:"you are not authorized to access this route"
        })   
    }
   try{
    const verifyToken = await jwt.verify(
        token, process.env.TOKEN_SECRET
    )

  
    req.user = await User.findById(verifyToken.userId)

    if (!req.user) {
        return next(new ErrorResponse("User not found", 404));
    }
    next()

   }catch(error){
    console.log(error)
    return next(new ErrorResponse("you must log in", 401))
   }
}

export const verifyAdmin = (req,res,next)=>{
    if (!req.user) {
        return next(new ErrorResponse("User not found", 404));
    }

    // Check if the user has admin privileges
    if (req.user.isAdmin === false) {
        return next(new ErrorResponse("Access denied, you are not an admin", 401));
    }
    next();
}
