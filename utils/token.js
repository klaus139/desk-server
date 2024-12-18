import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


export const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(activationCode)

    const token = jwt.sign({
        user,
        activationCode
    }, process.env.ACTIVATION_SECRET,{
        expiresIn:'30m'
    })

    return {token, activationCode}
}