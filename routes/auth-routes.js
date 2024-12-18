import express from "express"
import { registerUser, loginUser, createUserWithValidation, activateUser } from "../controllers/authController.js";


const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser)

router.post('/reg', createUserWithValidation);

router.post('/verify-user', activateUser);

export default router;