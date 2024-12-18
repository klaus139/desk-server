import express from "express"
import { verifyAdmin, verifyUser } from "../middleware/verifyToken.js"
import { createJob, deleteJob, getAllJobs, getJob, showJobs, updateJob } from "../controllers/jobController.js"

const router = express.Router()

router.post('/create', verifyUser, verifyAdmin, createJob);

router.get("/all-jobs", getAllJobs);

router.get("/get-job/:id", getJob);

router.delete("/delete-job/:id", verifyUser, verifyAdmin, deleteJob);

router.put('/update-job/:id', verifyUser, verifyAdmin, updateJob);

router.get('/show-jobs', showJobs);

export default router;