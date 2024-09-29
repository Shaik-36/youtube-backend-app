import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// Configure env variables
import dotenv from "dotenv"
dotenv.config(
    {
        path: './.env'
    }
)





    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.C_CLOUD_NAME, 
        api_key: process.env.C_API_KEY, 
        api_secret: process.env.C_API_SECRET
    });


const uploadOnCloudinary = async (localFilePath) => {

    try {
        
        if (!localFilePath) return console.log("File path is not found");
        
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return console.log("Error uploading the files to Cloudinary:", error);
        ;
    }
}



export {uploadOnCloudinary}