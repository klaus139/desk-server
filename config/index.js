import dotenv from "dotenv"
dotenv.config();


const appTokens = {
    accessTokenSecret: process.env.TOKEN_SECRET,
    accessTokenExpiresIn: process.env.TOKEN_TIME
}

export default appTokens;