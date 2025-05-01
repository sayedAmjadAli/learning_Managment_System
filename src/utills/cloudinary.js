import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from '../config/env.js';
import { AppError } from '../middleware/error.middleware.js';



cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const uploadCloudinary = async function (localPath) {

    try {
        const response = await cloudinary.uploader.upload(localPath, { resource_type: "auto" })
        //when file uploaded successfully then delete the file from server
        fs.unlinkSync(localPath)
        return response
    } catch (error) {

        //if any error occur also delete the file
        fs.unlinkSync(localPath)
        throw new AppError(401, "Error occur while uploading the file")
    }
}


const deleteResourseFromCloudinary = async (publicId) => {
    try {
        const response = await cloudinary.uploader.destroy(publicId)
        console.log("Resource Deleted successfully")
        return response
    } catch (error) {
        throw new AppError(400, `Error occur while deleting resource from cloudinary ! ${error.message}`)

    }
}
export {
    uploadCloudinary,
    deleteResourseFromCloudinary
}
