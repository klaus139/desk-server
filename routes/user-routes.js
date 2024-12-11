import express from "express"
import { deleteUser, getAllUsers, getuser, updateUser } from "../controllers/userController.js"
const router = express.Router()



router.get('/all', getAllUsers)

router.get('/:id', getuser)

router.put('/:id', updateUser)

router.delete("/:id", deleteUser)

export default router