import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionIstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB Connected! DB HOST: ${connectionIstance.connection.host}`)
    } catch (error) {
        console.error("MongoDB connection Error: ", error);
        process.exit(1)
    }
}

export default connectDB