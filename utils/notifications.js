import nodemailer from 'nodemailer'
import dotenv from "dotenv"
dotenv.config();
import {dirname} from "path"

import {fileURLToPath} from "url"
import path from "path"
import ejs from "ejs"


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const transport = nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:"emmp.org.ng@gmail.com",
        pass:"mjoh xzgs nzya lbum"
    },
    tls:{
        rejectUnauthorized:false
    }

})

export const mailSent1 = async(options) => {
    const {email, subject, template, emailData} = options;

    const templatePath = path.resolve(__dirname, "../mails", template)

    try{
        const html = await ejs.renderFile(templatePath, emailData)
        const mailOptions = {
            from: "deskon@gmail.com",
            to:email,
            subject,
            html
        }

        await transport.sendMail(mailOptions)
        console.log('email sent successfully', email)

    }catch(error){
        console.log(error)
    }
}