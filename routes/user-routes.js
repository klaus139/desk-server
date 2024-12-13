import express from "express"
import { deleteUser, getAllUsers, getuser, updateUser } from "../controllers/userController.js"
import { verifyAdmin, verifyUser } from "../middleware/verifyToken.js"
const router = express.Router()



router.get('/all', verifyUser, verifyAdmin, getAllUsers)

router.get('/:id', verifyUser, getuser)

router.put('/:id', verifyUser, updateUser)

router.delete("/:id", verifyUser, deleteUser)

export default router