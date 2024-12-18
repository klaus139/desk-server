import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;  // Destructuring to get Schema and Types from mongoose


const jobSchema = new Schema({
    title:{
        type:String,
        required:[true, "Title is required"]
    },
    description:{
        type:String,
        required:[true, "Description is required"]
    },
    fulldetails:{
        type:String,
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
       
    },
    available:{
        type:Boolean,
        default:true,
    },
    jobType:{
        type:String,
    },
    user: {
        type: Types.ObjectId,  // Using Types.ObjectId for proper ObjectId reference
        ref: "User",
        required: true
    }
},{timestamps:true});

const Job = model("Job",jobSchema)
export default Job;

