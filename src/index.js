// require('dotenv').config({ path: './env' })
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
dotenv.config()


connectDB()







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