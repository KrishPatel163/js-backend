import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_NAME,
  api_secret: process.env.CLOUDINARY_API_SECERT,
});

const uploadToCloudinary = async (localfile) => {
    try {
        if (! localfile) { throw new ApiError(500, "Couldnt Locate the file path to upload to cloudinary") }
        //Upload the file to cloudinary
        const uploadData = await cloudinary.uploader.upload(localfile, {
            resource_type:"auto"
        })
        console.log(localfile)
        console.log(`File has been uploaded to Cloudinary!, ${uploadData}`)
        fs.unlinkSync(localfile)
        return uploadData
    } catch (error) {
        console.log(error)
        fs.unlinkSync(localfile)
        throw new ApiError(error.code, "catch part of the cloudinary util")
    }
};

export default uploadToCloudinary;