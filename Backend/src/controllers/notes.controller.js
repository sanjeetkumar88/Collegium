import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  jwt  from "jsonwebtoken";
import {Note} from "../models/notes.model.js"
import fs from "fs"



const uploadnotes = asyncHandler(async(req,res) => {
    try {
        const { title, description, type, subject, isPublic } = req.body;
        const userId = req.user.id;

        if([title, description, type, subject, isPublic].some((field)=> field?.trim() === "")){
            throw new ApiError(400,"All field are require")
        }
        const NotesLocalPath = req.files?.notes[0]?.path;

        
        if(!NotesLocalPath){
            throw new ApiError(400,"Notes is required in localpath")
        }

        const uploadedNotes = await uploadOnCloudinary(NotesLocalPath, "raw")

        if(!uploadedNotes){
            throw new ApiError(400,"Notes is required")
        }
        // const fileUrl = .replace("/upload/", "/upload/fl_attachment/");
        const newNotes = await Note.create({
            title,
            description,
            type,
            subject,
            fileUrl:uploadedNotes.secure_url, // Save the Cloudinary URL
            user: userId,
            isPublic: isPublic !== undefined ? isPublic : true,
        });

        const createdNotes = await Note.findById(newNotes._id).select(
            "-is_deleted "
          );

          if(!createdNotes){
            throw new ApiError(500,"Something happend while uploading notes")
          }

          return res
          .status(201)
          .json(new ApiResponse(200, createdNotes, "User registered Successfully"));
      

    
    } catch (error) {
        if (error.uploadedNotes?.public_id) {
            await deleteFromCloudinary(error.uploadedNotes.public_id);
        }
        throw new ApiError(401,error?.message || "Someting wrong happend")
    }
})

const getNotes = asyncHandler(async (req, res) => {
    try {
        const { type, userId, subject, isPublic, page, limit, title } = req.query;

        const filters = {};

        // User-based filtering
        if (userId) {
            if (isPublic !== undefined) {
                filters.isPublic = isPublic === "true";
            }
            filters.user = userId;
        } else {
            filters.isPublic = true;
        }

        // Exact match for type
        if (type) {
            filters.type = type;
        }

        // ✅ Partial match for subject
        if (subject) {
            filters.subject = { $regex: subject, $options: "i" };
        }

        // ✅ Partial match for title
        if (title) {
            filters.title = { $regex: title, $options: "i" };
        }

        // Pagination settings
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        // Fetch filtered notes
        const notes = await Note.find(filters)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .select("-is_deleted");

        // Count total notes matching criteria
        const totalNotes = await Note.countDocuments(filters);

        return res.status(200).json(new ApiResponse(200, {
            notes,
            totalPages: Math.ceil(totalNotes / pageSize),
            currentPage: pageNumber
        }, "Notes fetched successfully"));

    } catch (error) {
        throw new ApiError(500, error?.message || "Failed to fetch notes");
    }
});


export{
    uploadnotes,
    getNotes,

}