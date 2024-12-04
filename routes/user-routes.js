import express from "express"
const router = express.Router()
import { allUsers } from "../dummyData.js"



router.get('/all', (req, res) => {
    res.status(200).json({
        allUsers
    })
})

export default router