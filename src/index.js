

// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from './db/index.js'

import { app } from "./app.js"

dotenv.config(
    {
        path: './.env'
    }
)



connectDB()
.then(() => {
    app.listen( process.env.PORT, () => {

        console.log(`Server is running at port: http://localhost:${process.env.PORT}`);
        
    })
})
.catch((err) => {
    console.log("MONGO DB CONNECTION FAILED !!!", err);
    
})















/*  Approach - 1 - Connecting to Database

import express from "express"
const app = express()

;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", () => {
            console.log("ERROR", error);
            throw error
            
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening at ${process.env.PORT}`);
            
        })
    }
    catch (error) {
        console.log("Error while connecting to database", error)
        throw error
    }
})()


*/