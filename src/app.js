import express, { urlencoded } from 'express'


const app = express()


// ***************************  Middle Ware START ************************************

import cors from 'cors'
import cookieParser from 'cookie-parser'

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
))

// We get data from URL, JSON, forms. so we need to keep a limit
app.use(express.json({limit: "16kb"}))


// When data goes in URl some palces it's + and some places %20. to make it understand we need a configuration
app.use(express.urlencoded({extended: true, limit: "16KB"}))

// When you want to store pdf, images, favicon files in your server in a public folder on server. Incase you need for temperory access
app.use(express.static("public"))

// Cookie Parser - To access and set cookies in user browser from server. Scure Cookies - only server can read and remove
app.use(cookieParser())

// ***************************  Middle Ware END ************************************




//**************************   Routes START   **************************************** */

//  --------  Routes Import  --------------

import router from './routes/user.routes.js'





//  -------  Routes Declaration  ------------

app.use("/api/v1/users", router)                    //http://localhost:8000/api/v1/users/




//**************************   Routes END   **************************************** */







export {app}