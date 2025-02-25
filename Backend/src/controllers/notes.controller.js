import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  jwt  from "jsonwebtoken";
import {Note} from "../models/notes.model.js"
import fs from "fs"



const uploadnotes = asyncHandler(async(req,res) => {
    try {
        const { title, description, type, tags, isPublic } = req.body;
        const userId = req.user.id;

        if([title, description, type, tags, isPublic].some((field)=> field?.trim() === "")){
            throw new ApiError(400,"All field are require")
        }
        const NotesLocalPath = req.files?.notes[0]?.path;
        console.log(NotesLocalPath);

        
        if(!NotesLocalPath){
            throw new ApiError(400,"Notes is required in localpath")
        }

        const uploadedNotes = await uploadOnCloudinary(NotesLocalPath)

        if(!uploadedNotes){
            throw new ApiError(400,"Notes is required")
        }
        const newNotes = await Note.create({
            title,
            description,
            type,
            tags,
            fileUrl: uploadedNotes.url, // Save the Cloudinary URL
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
        const { type, userId, tags, isPublic, page = 1, limit = 10 } = req.query;

        const filters = {};

        // If userId is provided, take isPublic from query; otherwise, default to public notes
        if (userId) {
            if (isPublic !== undefined) {
                filters.isPublic = isPublic === "true"; // Convert string to boolean
            }
            filters.user = userId; // Filter by specific user
        } else {
            filters.isPublic = true; // Only fetch public notes if no userId is provided
        }

        // Filter by note type
        if (type) {
            filters.type = type;
        }

        // Filter by tags (comma-separated)
        if (tags) {
            const tagsArray = tags.split(",").map(tag => tag.trim());
            filters.tags = { $in: tagsArray };
        }

        // Pagination settings
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        // Fetch notes with filters, pagination, and sorting
        const notes = await Note.find(filters)
            .sort({ createdAt: -1 }) // Sort by newest notes first
            .skip(skip)
            .limit(pageSize)
            .select("-is_deleted"); // Exclude deleted field

        // Get total notes count for pagination info
        const totalNotes = await Note.countDocuments(filters);

        if (!notes.length) {
            throw new ApiError(404, "No notes found.");
        }

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