import Job from "../models/jobModel.js";

// export const createJob = async (req, res) => {
//     try {
//         // Destructure fields from the request body
//         const {
//             title,
//             description,
//             companyName,
//             location,
//             salary,
//             jobType,
//             user
//         } = req.body;

//         // Check if all required fields are present
//         if (!title || !description || !location || !salary || !user) {
//             return res.status(400).json({
//                 message: "Missing required fields"
//             });
//         }

//         // Validate if the user exists in the database
//         const existingUser = await User.findById(user);
//         if (!existingUser) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         // Create the new job object
//         const newJob = new Job({
//             title,
//             description,
//             companyName,
//             location,
//             salary,
//             jobType,
//             user: existingUser._id, // Reference to the existing user
//         });

//         // Save the new job to the database
//         await newJob.save();

//         // Return the created job in the response
//         return res.status(201).json({
//             message: "Job created successfully",
//             job: newJob,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Internal server error",
//         });
//     }
// };


export const createJob = async(req,res)=>{
    try{
        const job = await Job.create({
            title: req.body.title,
            description:req.body.description,
            companyName:req.body.companyName,
            location:req.body.location,
            salary:req.body.salary,
            fulldetails:req.body.fulldetails,
            jobType:req.body.jobType,
            user:req.user.id
        })

        return res.status(201).json({
            message:"Job created successfully",
            job
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}

export const getAllJobs = async(req,res)=>{
    try{
        const allJobs = await Job.find();

        return res.status(200).json({
            data:allJobs
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"internal server error"
        })

    }
}

export const getJob = async(req,res)=>{
    try{
        const id = req.params.id;

        const foundJob = await Job.findById(id)

        if(!foundJob){
            return res.status(404).json({
                message:"Job not found"
            })

        }

        return res.status(200).json({
         foundJob
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const deleteJob = async(req,res)=>{
    try{
        const id = req.params.id;

        const deleteJob = await Job.findByIdAndDelete(id)

        if(!deleteJob){
            return res.status(404).json({
                message:"job does not exists"
            })
        }

        return res.status(200).json({
            message:"Job deleted successfully"
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const updateJob = async(req,res)=>{
    try{
        const id = req.params.id;
        const {...body} = req.body;



        const updatedJob = await Job.findByIdAndUpdate(id, body,{new:true, runValidators:true})

        if(!updatedJob){
            return res.status(404).json({
                message:`job with id: ${id} does not exist`
            })
        }

        return res.status(200).json({
            "data":updatedJob
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// export const showJobs = async(req, res) =>{
//     try{
//         const keyword = req.query.keyword ? {
//             title:{
//                 $regex:req.query.keyword,
//                 $options:'i'
//             }
//         }:{}

//         let locations = []
//         const jobsByLocation = await Job.find({}, {location:1});
//         jobsByLocation.forEach(val => {
//             locations.push(val.location)
//         });
//         let setUniqueLocation = [... new Set(locations)];
//         let location = req.query.location; 
//         let locationFilter = location !== ''  ? location : setUniqueLocation;

//         //enable pagination
//         const pageSize = 5;
//         const page = Number(req.query.pageNumber) || 1;
//         const count = await Job.find({...keyword, location:locationFilter}).countDocuments();

//         const jobs = await Job.find({...keyword, location:locationFilter}).sort({createdAt:-1}).populate('user', 'firstname').skip(pageSize * (page -1)).limit(pageSize)
//         res.status(200).json({
//             success:true,
//             jobs,
//             page,
//             pages:Math.ceil(count / pageSize),
//             count,
//             setUniqueLocation
//         })

//     }catch(error){
//         console.log(error)
//         return res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// }

export const showJobs = async (req, res) => {
    try {
        const { keyword, location, pageNumber = 1 } = req.query;

        // Prepare keyword search filter
        const keywordFilter = keyword ? {
            title: { 
                $regex: keyword, 
                $options: 'i' 
            }
        } : {};

        // Prepare location filter
        let locationFilter = location ? { location } : {};

        // Optimize location fetching with aggregation (no need to query all jobs just for unique locations)
        const uniqueLocations = await Job.aggregate([
            { $group: { _id: "$location" } },
            { $project: { location: "$_id", _id: 0 } }
        ]);
        const setUniqueLocation = uniqueLocations.map(val => val.location);

        // Set location filter if no location provided in query
        if (!location) locationFilter = { location: { $in: setUniqueLocation } };

        // Pagination Setup
        const pageSize = 5;
        const page = Number(pageNumber);

        // Count the total number of documents that match the search query
        const count = await Job.countDocuments({ ...keywordFilter, ...locationFilter });

        // Fetch the jobs with sorting, pagination, and population
        const jobs = await Job.find({ ...keywordFilter, ...locationFilter })
            .sort({ createdAt: -1 }) // Sort by most recent
            .populate('user', 'firstname') // Populate the user info
            .skip(pageSize * (page - 1)) // Skip based on current page
            .limit(pageSize); // Limit results to pageSize

        res.status(200).json({
            success: true,
            jobs,
            page,
            pages: Math.ceil(count / pageSize),
            count,
            setUniqueLocation,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

