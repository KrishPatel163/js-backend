// require('dotenv').config({ path: './env' })
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config()


connectDB()
.then(() => {
    app.on("error",(error) => {
        console.log(`index.js ran into a Error: ${error}`)
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`index.js is listenting on Port: ${process.env.PORT}`)
    })
})
.catch((e) => {
    console.error(`index.js couldnt connect to MongoDB: ${e}`);
})






// import express from "express";
// const app = express()
// ( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.error("error", (error) => {
//             console.error("Express Error: ", error);
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listenting on Port: ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.error("Error: ", error);
//         throw error
//     }
// })()