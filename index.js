import express from "express"
import dotenv from "dotenv"
dotenv.config()
import morgan from "morgan"
import authRoutes from "./routes/auth-routes.js"
import userRoutes from "./routes/user-routes.js"
import { connectDB } from "./config/db.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan('dev'));

connectDB()

const port = process.env.PORT;

const gae = 30;

//middleware

app.use('/auth', authRoutes)
app.use('/user', userRoutes);





app.listen(port, () => console.log(`server is running on port ${port}`))