import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  jwt  from "jsonwebtoken";
import {Note} from "../models/notes.model.js"
import fs from "fs"
import { generatePdfThumbnail } from "../utils/generatePdfThumbnail.js"; 
import { sendMail } from "../utils/sendMail.js";

const uploadnotes = asyncHandler(async (req, res) => {
  try {
    const { title, description, type, subject, isPublic, branch, } = req.body;
    const userId = req.user.id;

    if ([title, description, type, subject, branch].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const NotesLocalPath = req.files?.notes[0]?.path;

    if (!NotesLocalPath) {
      throw new ApiError(400, "Notes file is required");
    }

    // Generate PDF thumbnail if it's a PDF
    let thumbnailPath = "";
    if (NotesLocalPath.endsWith(".pdf")) {
      thumbnailPath = await generatePdfThumbnail(NotesLocalPath);
    }

    // Upload notes file to Cloudinary
    const uploadedNotes = await uploadOnCloudinary(NotesLocalPath, "raw");
    if (!uploadedNotes) {
      throw new ApiError(400, "Failed to upload notes file");
    }

    // Upload thumbnail to Cloudinary if it exists
    let uploadedThumbnail = "";
    if (thumbnailPath) {
      uploadedThumbnail = await uploadOnCloudinary(thumbnailPath, "image");
    }

    // Create the note record in DB
    const newNote = await Note.create({
      title,
      description,
      type,
      subject,
      fileUrl: uploadedNotes.secure_url, 
      thumbnail: uploadedThumbnail ? uploadedThumbnail.secure_url : "", 
      author: userId,
      isPublic: isPublic !== undefined ? isPublic : true,
      branch,
    });

    
    const createdNote = await Note.findById(newNote._id).select("-is_deleted");

    
    

    if (!createdNote) {
      throw new ApiError(500, "Something went wrong while uploading notes");
    }
    else{
        await sendMail({
            to: req.user.email, 
            subject: "Notes Uploaded Successfully",
            html: `<h2>Hi ${req.user.name},</h2><p>Your note titled <b>${title}</b> was uploaded successfully!</p>`,
          });
    }

    
    

    return res.status(201).json(new ApiResponse(200, createdNote, "Note uploaded successfully"));

  } catch (error) {
    
    if (error.uploadedNotes?.public_id) {
      await deleteFromCloudinary(error.uploadedNotes.public_id);
    }
    if (error.uploadedThumbnail?.public_id) {
      await deleteFromCloudinary(error.uploadedThumbnail.public_id);
    }

    throw new ApiError(401, error?.message || "Something went wrong");
  }
});

// const getNotes = asyncHandler(async (req, res) => {
//     try {
//       const {
//         type,
//         userId,
//         subject,
//         page,
//         limit = 15,
//         title,
//         branch
//       } = req.query;
  
//       const filters = {};
  
//       const pageNumber = parseInt(page, 10) || 1;
//       const pageSize = parseInt(limit, 10) || 15;
//       const skip = (pageNumber - 1) * pageSize;
  
//       if (userId) {
//         filters.$or = [
//           { author: userId },
//           { isPublic: true }
//         ];
//       } else {
//         filters.isPublic = true;
//       }
  
//       if (type) filters.type = type;
//       if (subject) filters.subject = { $regex: subject, $options: "i" };
//       if (title) filters.title = { $regex: title, $options: "i" };
//       if (branch) filters.branch = branch;
  
//       const notes = await Note.find(filters)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(pageSize)
//         .select("-is_deleted")
//         .lean();
  
//       const totalNotes = await Note.countDocuments(filters);
  
//       return res.status(200).json(new ApiResponse(200, {
//         notes,
//         totalPages: Math.ceil(totalNotes / pageSize),
//         currentPage: pageNumber
//       }, "Notes fetched successfully"));
  
//     } catch (error) {
//       throw new ApiError(500, error?.message || "Failed to fetch notes");
//     }
//   });
  
const getNotes = asyncHandler(async (req, res) => {
    try {
      const {
        type,
        userId,
        subject,
        page,
        limit = 15,
        title,
        branch
      } = req.query;
  
      const filters = {};
  
      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = parseInt(limit, 10) || 15;
      const skip = (pageNumber - 1) * pageSize;
  
      // Only show notes authored by the user if userId is present
      if (userId) {
        filters.author = userId;
      } else {
        // Otherwise only show public notes
        filters.isPublic = true;
      }
  
      if (type) filters.type = type;
      if (subject) filters.subject = { $regex: subject, $options: "i" };
      if (title) filters.title = { $regex: title, $options: "i" };
      if (branch) filters.branch = branch;
  
      const notes = await Note.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .select("-is_deleted")
        .lean();
  
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
  

const deleteNote = asyncHandler(async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;
  
    const note = await Note.findOne({ _id: noteId, author: userId });
    if (!note) throw new ApiError(404, "Note not found or unauthorized");
  
    await note.deleteOne();
  
    return res.status(200).json(new ApiResponse(200, {}, "Note deleted successfully"));
  });

  const updateNote = asyncHandler(async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;
    const { title, description, subject, branch, isPublic } = req.body;
  
    const note = await Note.findOneAndUpdate(
      { _id: noteId, author: userId },
      { $set: { title, description, subject, branch, isPublic } },
      { new: true }
    ).select("-is_deleted");
  
    if (!note) throw new ApiError(404, "Note not found or unauthorized");
  
    return res.status(200).json(new ApiResponse(200, note, "Note updated successfully"));
  });

  const getUserNotes = asyncHandler(async (req, res) => {
    const userId = req.user.id;
  
    const notes = await Note.find({ author: userId }).select("-is_deleted").sort({ createdAt: -1 });
  
    return res.status(200).json(new ApiResponse(200, notes, "User notes fetched successfully"));
  });
  

export{
    uploadnotes,
    getNotes,
    deleteNote,
    updateNote,
    getUserNotes,

}