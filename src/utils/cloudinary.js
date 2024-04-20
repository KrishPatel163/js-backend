import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_NAME,
  api_secret: process.env.CLOUDINARY_API_SECERT,
});

const uploadToCloudinary = async (localfile) => {
    try {
        if (! localfile) { return null }
        //Upload the file to cloudinary
        const uploadData = await cloudinary.uploader.upload(localfile, {
            resource_type:"auto"
        })

        console.log(`File has been uploaded to Cloudinary!, ${uploadData}`) 
        return uploadData
    } catch (error) {
        fs.unlinkSync(localfile)
        return null
    }
};
