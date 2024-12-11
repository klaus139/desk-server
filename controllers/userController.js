import User from "../models/userModel.js"

export const getAllUsers = async (req, res) => {
    console.log('we got here');
    try {
        // Fetch all users from the database
        const allUsers = await User.find();

        // Send the users back in the response
        return res.status(200).json({
            data: allUsers
        });
    } catch (error) {
        console.log(error);
        // Handle errors and send an appropriate response
        return res.status(500).json({
            message: "Error getting all users"
        });
    }
};


export const getuser = async(req,res)=>{
    try{
        const id = req.params.id;

        const user = await User.findById(id)
        
        if(!user){
            return res.status(404).json({
                message:`user with id: ${id} does not exist`
            })
        }
        return res.status(200).json({
            "data":user
        })
           

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "Error getting user"
        });

    }
}

export const updateUser = async(req,res)=>{
    try{
        const id = req.params.id;
        const {...body} = req.body;



        const updatedUser = await User.findByIdAndUpdate(id, body,{new:true, runValidators:true})

        if(!updatedUser){
            return res.status(404).json({
                message:`user with id: ${id} does not exist`
            })
        }

        return res.status(200).json({
            "data":updatedUser
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const deleteUser = async(req,res)=>{
    try{
        const id = req.params.id;

        await User.findByIdAndDelete(id)
        
        return res.status(204).json({
            message:"user deleted successfully"
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        });

    }
}