import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: 'dthif7dtz', 
  api_key: '256429975251592', 
  api_secret:'ia4oy_fAjSi81PLqOGp4NlnUtLE' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("No file path provided");
            return null;
        }
        
        console.log("Uploading file to Cloudinary:", localFilePath);
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        console.log("Upload response:", response);
        
        // File uploaded successfully, delete the local file
        fs.unlinkSync(localFilePath);
        
        return response;

    } catch (error) {
        console.error("Error uploading file:", error);
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file if upload fails
        return null;
    }
};



export {uploadOnCloudinary}