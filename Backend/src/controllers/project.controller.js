import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import mongoose from "mongoose";

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

  const getAllProject = asyncHandler(async (req, res) => {
    let { userId, page, limit = 15, title, category } = req.query;
    
    
    

    
    page = Number(page) || 1;
    limit = Number(limit) || 15;
    const skip = (page - 1) * limit;

    const matchStage = {};

    
    if (userId) {
        if (mongoose.Types.ObjectId.isValid(userId)) {
            matchStage.createdBy =  new mongoose.Types.ObjectId(userId);
        } else {
            // Handle invalid userId format if necessary
            return res.status(400).json({ message: "Invalid userId format" });
        }
    }

    // Add title filter if provided
    if (title) {
        matchStage.title = { $regex: title, $options: 'i' }; // case-insensitive search
    }

    // Add category filter if provided
    if (category) {
        matchStage.category = category;
    }

    // Aggregation pipeline to fetch the projects
    const projectsAggregate = await Project.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: "users", // your users collection
                localField: "createdBy",
                foreignField: "_id",
                as: "createdByInfo"
            }
        },
        { $unwind: "$createdByInfo" },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                category: 1,
                coverImage: 1,
                createdAt:1,
                createdBy: "$createdByInfo.fullName" // or username if needed
            }
        },
        { $sort: { createdAt: -1 } },  // Sort by createdAt (latest first)
        { $skip: skip },  // Skip the correct number of projects for pagination
        { $limit: limit }  // Limit results per page
    ]);

    // Get the total number of projects matching the filter criteria
    const totalProjects = await Project.countDocuments(matchStage);
    const totalPages = Math.ceil(totalProjects / limit);  // Calculate total pages

    return res.status(200).json(
        new ApiResponse(200, { totalProjects, totalPages, projects: projectsAggregate }, "Projects fetched successfully")
    );
});

const getProjectDetail = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(projectId) } },

      // Join with 'createdBy' to get project author's details
      {
        $lookup: {
          from: 'users', // Assuming the user collection is named 'users'
          localField: 'createdBy',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },

      // Join with 'members' array to get member details
      {
        $lookup: {
          from: 'users', // Assuming the user collection is named 'users'
          localField: 'members.user',
          foreignField: '_id',
          as: 'membersDetails',
        },
      },

      // Project data formatting
      {
        $project: {
          title: 1,
          description: 1,
          coverImage:1,
          problemStatement: 1,
          category: 1,
          status: 1,
          projectUrl: 1,
          githubRepo: 1,
          technologiesUsed: 1,
          openForCollaboration: 1,
          createdBy: '$author', // Include author details
          members: {
            $map: {
              input: '$membersDetails',
              as: 'member',
              in: {
                id: '$$member._id',
                logo: '$$member.logo',
                name: '$$member.fullName',
                username: '$$member.username',
                role: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$members',
                        as: 'm',
                        cond: { $eq: ['$$m.user', '$$member.user'] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    if (!project || project.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const formattedProject = project[0]; 

  
    const responseData = {
      title: formattedProject.title,
      description: formattedProject.description,
      coverImage:formattedProject.coverImage,
      problemStatement: formattedProject.problemStatement || '',
      category: formattedProject.category,
      status: formattedProject.status,
      liveLink: formattedProject.projectUrl,  
      githubLink: formattedProject.githubRepo,  
      technologiesUsed: formattedProject.technologiesUsed,
      openForCollaboration: formattedProject.openForCollaboration,  
      author: {
        name: formattedProject.createdBy.name,
        username: formattedProject.createdBy.username,
        logo: formattedProject.createdBy.logo || '',
      },
      members: formattedProject.members.map(member => ({
        id: member.id,
        logo: member.logo || '',
        name: member.name,
        username: member.username,
        role: member.role || 'Member',  
      })),
    };

    res.status(200).json({
      message: 'Project details fetched successfully',
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};


const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id; // Assuming the user is authenticated and the user ID is added to req.user by the middleware

    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify if the user is the creator of the project
    if (project.createdBy.toString() !== userId.toString() ) {
      return res.status(403).json({ message: 'You are not authorized to delete this project' });
    }

    // Proceed to delete the project
    await project.deleteOne();

    res.status(200).json({ message: 'Project deleted successfully' });

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

const leaveProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id; // Get the logged-in user's ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is a member of the project
    if (!project.members.includes(userId)) {
      return res.status(400).json({ message: 'You are not a member of this project' });
    }

    // Remove the user from the project's members list
    project.members.pull(userId);
    await project.save();

    res.status(200).json({
      message: 'Successfully left the project',
      data: project,
    });
  } catch (error) {
    console.error('Error leaving project:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

const getProjectMembers = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Find the project and populate the members field
    const project = await Project.findById(projectId).populate('members', 'fullName email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({
      message: 'Project members fetched successfully',
      data: project.members,
    });
  } catch (error) {
    console.error('Error fetching project members:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

const joinProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id;
    const {role,message } = req.body;

    
    
    if (!role) {
      return res.status(400).json({ message: 'role cannot be empty' });
    }

    const project = await Project.findById(projectId);

    if(req.user.role === 'admin'){
      throw new ApiError(400,"Admin cannot join the project" || error.message)
    }
    console.log(project.createdBy);
    

    if(project.createdBy === userId){
      throw new ApiError(400,"Author cannot join the project" || error.message)
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.openForCollaboration) {
      return res.status(400).json({ message: 'This project is not open for collaboration' });
    }

    const alreadyRequested = project.joinRequests.some(
      (request) => request.user.toString() === userId.toString()
    );

    if (alreadyRequested) {
      return res.status(400).json({ message: 'You have already requested to join this project' });
    }

    project.joinRequests.push({
      user: userId,
      message: message || '',
      role: role,
    });

    await project.save();

    res.status(200).json({
      message: 'Join request sent successfully',
    });
  } catch (error) {
    console.error('Error sending join request:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

const approveJoinRequest = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.body.userId; 
    const action = req.body.action;
    console.log(action,userId,projectId);
    

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the current user is the creator of the project
    if (req.user._id.toString() !== project.createdBy.toString()) {
      return res.status(403).json({ message: 'You are not authorized to approve/reject join requests' });
    }

    const joinRequestIndex = project.joinRequests.findIndex(
      (request) => request.user.toString() === userId.toString()
    );

    if (joinRequestIndex === -1) {
      return res.status(400).json({ message: 'Join request not found' });
    }

    const joinRequest = project.joinRequests[joinRequestIndex];

    if (action === 'approve') {
      project.members.push({
        user: joinRequest.user,
        role: joinRequest.role,
      });
      project.joinRequests.splice(joinRequestIndex, 1); // Remove the join request after approval
    } else if (action === 'reject') {
      project.joinRequests.splice(joinRequestIndex, 1); // Simply remove the join request if rejected
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await project.save();

    res.status(200).json({
      message: action === 'approve' ? 'Join request approved' : 'Join request rejected',
      data: project,
    });
  } catch (error) {
    console.error('Error approving/rejecting join request:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};


const getJoinRequests = async (req, res) => {
  try {
    const projectId = req.params.id;
    console.log(projectId);
    

    const project = await Project.findById(projectId)
      .populate('joinRequests.user', 'avatar _id fullName username');

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, project.joinRequests, "Join requests fetched"));
  } catch (error) {
    // Let the global error handler catch this
    throw new ApiError(500, error.message || "Server error while fetching join requests");
  }
};

export const updateProjectCoverImage = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const coverImgLocalPath = req.file?.path; // multer.single("coverImage") gives req.file
    if (!coverImgLocalPath) {
      throw new ApiError(400, "Cover image file is required");
    }

    const uploadedImg = await uploadOnCloudinary(coverImgLocalPath, "image");
    if (!uploadedImg?.secure_url) {
      throw new ApiError(400, "Image upload failed");
    }

    project.coverImage = uploadedImg.secure_url;
    await project.save();

    return res
      .status(200)
      .json(new ApiResponse(200, project, "Cover image updated successfully"));
  } catch (error) {
    // return res.status(error.status || 500).json(
    //   new ApiResponse(
    //     error.status || 500,
    //     error.message || "Something went wrong while updating cover image"
    //   )
    // );

    throw new ApiError(500, error.message || "Something went wrong while updating cover image")
  }
};

export const updateProjectDetails = async (req, res) => {
  try {
    const projectId = req.params.id;
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

    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Only allow the creator to update
    if (project.createdBy.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to edit this project");
    }

    // Update only the allowed fields
    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.category = category ?? project.category;
    project.tags = tags ?? project.tags;
    project.problemStatement = problemStatement ?? project.problemStatement;
    project.technologiesUsed = technologiesUsed ?? project.technologiesUsed;
    project.status = status ?? project.status;
    project.projectUrl = projectUrl ?? project.projectUrl;
    project.githubRepo = githubRepo ?? project.githubRepo;
    project.openForCollaboration = openForCollaboration ?? project.openForCollaboration;
    project.contactInfo = contactInfo ?? project.contactInfo;
    project.startDate = startDate ?? project.startDate;
    project.endDate = endDate ?? project.endDate;
    project.demoVideo = demoVideo ?? project.demoVideo;

    await project.save();

    return res
      .status(200)
      .json(new ApiResponse(200, project, "Project details updated successfully"));
  } catch (error) {
    return new ApiError(500, error.message || "Something wents wrong")
  }
};









  
  

 export{
        createProject,
        getAllProject,
        getProjectDetail, 
        approveJoinRequest,
        joinProject,
        getProjectMembers,
        leaveProject,
        deleteProject,
        getJoinRequests,
        

  }
  