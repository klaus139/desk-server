import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Title is required"]
    },
    description:{
        type:String,
        required:[true, "Description is required"]
    },
    companyName:{
        type:String,
    },
    location:{
        type:String,
        required:[true, "location is required"]
    },
    salary:{
        type:String,
        required:[true, "salary range is required"]
    },
    available:{
        type:Boolean,
        default:true,
    },
    jobType:{
        type:String,
    }
})