import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";

const createProject = asyncHandler(async (req, res) => {
    
    const {
      title,
      description,
      category,
      tags,
      problemStatement,
      technologiesUsed,
      status,
      projectUrl,
      githubRepo,
      openForCollaboration,
      contactInfo,
      startDate,
      endDate,
      demoVideo
    } = req.body;
  
   
    if ([title, description, category, tags, technologiesUsed, status, projectUrl, githubRepo, contactInfo, startDate].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }
  
   
    const existingProject = await Project.findOne({ title: title.toLowerCase() });
  
    if (existingProject) {
      throw new ApiError(409, "Project with this title already exists");
    }
  
    
    let coverImagePath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImagePath = req.files.coverImage[0].path;
    }
  
    
    let coverImageUrl;
    if (coverImagePath) {
      coverImageUrl = await uploadOnCloudinary(coverImagePath);
      if (!coverImageUrl) {
        throw new ApiError(400, "Error uploading cover image");
      }
    }
  
    
    const project = await Project.create({
      title,
      description,
      category,
      tags,
      problemStatement,
      technologiesUsed,
      status,
      projectUrl,
      githubRepo,
      openForCollaboration: openForCollaboration || false,
      contactInfo,
      startDate,
      endDate,
      demoVideo,
      coverImage: coverImageUrl.secure_url, 
      createdBy: req.user._id, 
    });
  
   
    const createdProject = await Project.findById(project._id)
      .populate('createdBy', 'fullName email')
      .populate('members', 'fullName email');
  
    if (!createdProject) {
      throw new ApiError(500, "Something went wrong while creating the project");
    }
  
    return res.status(201).json(
      new ApiResponse(200, createdProject, "Project created successfully")
    );
  });

 export{
        createProject,
  }
  