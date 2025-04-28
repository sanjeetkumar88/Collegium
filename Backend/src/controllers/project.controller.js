import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
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
                name: '$$member.name',
                username: '$$member.username',
                role: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$members',
                        as: 'm',
                        cond: { $eq: ['$$m.user', '$$member._id'] },
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
      liveLink: formattedProject.projectUrl,  // Renaming projectUrl to liveLink
      githubLink: formattedProject.githubRepo,  // Renaming githubRepo to githubLink
      technologiesUsed: formattedProject.technologiesUsed,
      openForCollaboration: formattedProject.openForCollaboration,  // Include collaboration status
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
        role: member.role || 'Member',  // Handle missing role
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
    if (project.createdBy.toString() !== userId.toString()) {
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
    const project = await Project.findById(projectId).populate('members', 'name email');

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
    const { message, role } = req.body;

    const validRoles = ['member', 'contributor', 'collaborator'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const project = await Project.findById(projectId);

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
      data: project,
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
    const userId = req.params.userId; // User who is being approved or rejected
    const action = req.body.action; // Action can be 'approve' or 'reject'

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





  
  

 export{
        createProject,
        getAllProject,
        getProjectDetail, 
        approveJoinRequest,
        joinProject,
        getProjectMembers,
        leaveProject,
        deleteProject,
        

  }
  