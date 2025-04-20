import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Club } from "../models/club.model.js";
import mongoose from "mongoose";

const createClub = asyncHandler(async (req, res) => {
  try {
    const { name, description, leader, mentor } = req.body;

    if (
      [name, description, leader, mentor].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existedClub = await Club.findOne({ name });

    if (existedClub) {
      throw new ApiError(409, "Club name is already takened");
    }

    const club = await Club.create({
      name,
      description,
      leader,
      mentor,
    });

    const createdClub = await Club.findById(club._id);

    if (!createdClub) {
      throw new ApiError(500, "Something wents wrong while creating the club");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdClub, "Club is created successfully"));
  } catch (error) {
    throw new ApiError(500, error);
  }
});

const getallclub = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { page = 1, limit = 12, type, tag, membership, name } = req.query;

    let pageNumber = parseInt(page, 10);
    let pageSize = parseInt(limit, 10);
    let skip = (pageNumber - 1) * pageSize;

    // Building the base filter based on type and tag
    let match = {
      is_deleted: false,
    };

    if (type) {
      match.visibility = type; // Public or Private
    }

    if (tag) {
      match.tags = tag; // Filter by tag
    }

    if (name) {
      match.name = { $regex: name, $options: "i" };
    }

    // Aggregation pipeline for fetching clubs
    let pipeline = [
      { $match: match }, // Filter by visibility, tags, and name
      {
        $project: {
          _id: 1,
          coverimage: 1,
          logo: 1,
          description: 1,
          name: 1,
          tags: 1,
          visibility: 1,
          status: {
            $cond: {
              if: { $in: [userId, { $ifNull: ["$members", []] }] },
              then: "Joined",
              else: {
                $cond: {
                  if: { $in: [userId, { $ifNull: ["$appliedUsers", []] }] },
                  then: "Applied",
                  else: "Apply",
                },
              },
            },
          },
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ];

    // Adding membership filter (joined, not_joined)
    if (membership === "joined") {
      pipeline.push({
        $match: { members: { $in: [userId] } },
      });
    } else if (membership === "not_joined") {
      pipeline.push({
        $match: { members: { $nin: [userId] } },
      });
    }

    // Fetching total number of clubs after filters
    const totalClubs = await Club.countDocuments(match);

    // Fetching clubs with the applied filters
    const clubs = await Club.aggregate(pipeline);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          clubs,
          totalPages: Math.ceil(totalClubs / pageSize),
          currentPage: pageNumber,
        },
        "Clubs fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching clubs"
    );
  }
});

const joinClub = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    

    const club = await Club.findById(id);
    if (!club) {
      throw new ApiError(404, "Club not found");
    }

    if (["admin", "teacher"].includes(req.user.role)) {
      throw new ApiError(400, "Admins and Teachers cannot join a club");
    }

    if (club.members.includes(userId)) {
      throw new ApiError(400, "You are already a member of this club");
    }

    if (club.coLeaders.includes(userId)) {
      throw new ApiError(400, "You are already a co-leader of this club");
    }

    if (club.leader.equals(userId)) {
      throw new ApiError(
        400,
        "You are the leader of this club, you cannot join it again"
      );
    }

    if (club.visibility === "private") {
      if (club.appliedUsers.includes(userId)) {
        throw new ApiError(
          400,
          "You have already applied to join this private club"
        );
      }

      club.appliedUsers.push(userId);
      await club.save();
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Application to join the private club submitted successfully"
          )
        );
    }

    club.members.push(userId);
    await club.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Successfully joined the club"));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          null,
          error.message || "Something went wrong while joining the club"
        )
      );
  }
});

const leaveClub = asyncHandler(async (req, res) => {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;

    const club = await Club.findById(clubId);
    if (!club) throw new ApiError(404, "Club not found");

    if (club.leader.equals(userId)) {
      throw new ApiError(
        400,
        "Leader cannot leave the club. Transfer leadership first."
      );
    }

    club.members = club.members.filter((id) => id.toString() !== userId);
    await club.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Successfully left the club"));
  } catch (error) {
    throw new ApiError(500, error.message || "Error leaving the club");
  }
});

const getClubDetails = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!id) {
      return res.status(400).json({ message: "Club ID is required" });
    }

    const clubDetails = await Club.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: "users",
            localField: "mentor",
            foreignField: "_id",
            as: "mentorDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "leader",
            foreignField: "_id",
            as: "leaderDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "coLeaders",
            foreignField: "_id",
            as: "coLeaderDetails",
          },
        },
        {
          $addFields: {
            // keep original IDs for role checks
            membersArray: { $ifNull: ["$members", []] },
            coLeadersArray: { $ifNull: ["$coLeaders", []] },
            appliedUsersArray: { $ifNull: ["$appliedUsers", []] },
            // human-readable versions
            mentor: {
              $map: {
                input: "$mentorDetails",
                as: "m",
                in: {
                  _id: "$$m._id",
                  fullName: "$$m.fullName",
                },
              },
            },
            leaderInfo: {
              $map: {
                input: "$leaderDetails",
                as: "l",
                in: {
                  _id: "$$l._id",
                  fullName: "$$l.fullName",
                },
              },
            },
          },
        },
        {
          $addFields: {
            userStatus: {
              $cond: [
                { $in: [userId, "$membersArray"] },
                "Joined",
                {
                  $cond: [
                    { $in: [userId, "$appliedUsersArray"] },
                    "Applied",
                    "Join",
                  ],
                },
              ],
            },
            role: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$leader", new mongoose.Types.ObjectId(userId)] },
                    then: "leader",
                  },
                  {
                    case: { $in: [userId, "$coLeadersArray"] },
                    then: "co-leader",
                  },
                  {
                    case: { $in: [userId, "$membersArray"] },
                    then: "member",
                  },
                  {
                    case: { $in: [new mongoose.Types.ObjectId(userId), "$mentor"] }, // optional: if mentor is still object array
                    then: "mentor",
                  },
                ],
                default: "non-member",
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            logo: 1,
            coverImg: "$coverimage",
            name: 1,
            status: 1,
            leaderInfo: 1,
            mentor: 1,
            totalMembers: { $size: "$membersArray" },
            visibility: 1,
            tags: 1,
            description: 1,
            userStatus: 1,
            role: 1,
          },
        },
      ]);
      

    if (!clubDetails || clubDetails.length === 0) {
      return res.status(404).json({ message: "Club not found" });
    }

    return res.status(200).json(clubDetails[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
});

const getClubMember = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Club ID is required" });
    }

    const clubmembers = await Club.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "memberdetail",
        },
      },
      {
        $addFields: {
          members: {
            $map: {
              input: "$memberdetail",
              as: "member",
              in: {
                _id: "$$member._id",
                username: "$$member.username",
                name: "$$member.fullName",
                avatar: "$$member.avatar",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          members: 1, // Directly use "members" as it’s transformed in $addFields
        },
      },
    ]);

    if (!clubmembers.length) {
      return res.status(404).json({ message: "Club not found" });
    }

    return res.status(200).json(clubmembers[0]);
  } catch (error) {
    console.error("Error fetching club members:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

const getclubcoleader = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Club ID is required" });
    }

    const clubmembers = await Club.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "coLeaders",
          foreignField: "_id",
          as: "coleaderdetail",
        },
      },
      {
        $addFields: {
          coleaders: {
            $map: {
              input: "$coleaderdetail",
              as: "coleader",
              in: {
                _id: "$$coleader._id",
                username: "$$coleader.username",
                name: "$$coleader.fullName",
                avatar: "$$coleader.avatar",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          coleaders: 1, // Ensure you are using the correct field
        },
      },
    ]);

    if (!clubmembers.length) {
      return res.status(404).json({ message: "Club not found" });
    }

    return res.status(200).json(clubmembers[0]);
  } catch (error) {
    console.error("Error fetching co-leaders:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

const getapplicants = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Club ID is required" });
    }

    const applicants = await Club.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
            from: "users",
            localField: "appliedUsers",
            foreignField: "_id",
            as: "applicantdetails",
          },
      },
      {
        $addFields : {
            applicants : {
                $map:{
                    input:"$applicantdetails",
                    as:"applicants",
                    in:{
                        _id:"$$applicants._id",
                        username:"$$applicants.username",
                        name:"$$applicants.fullName",
                        avatar:"$$applicants.avatar",
                    }
                }
            }
        }
      },
      {
        $project: {
          _id: 1,
          applicants: 1,
        },
      },

    ]);

    if (!applicants.length) {
        return res.status(404).json({ message: "Club not found" });
      }
  
      return res.status(200).json(applicants[0]);
  } catch (error) {
    console.error("Error fetching co-leaders:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

const approveApplicants = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { applicantId } = req.body;
    const userId = req.user._id;
    
    

    console.log(id);
    if (!applicantId) {
      throw new ApiError(400, "Applicant ID is required");
    }

    const club = await Club.findById(id);
    if (!club) {
      throw new ApiError(404, "Club not found");
    }

    // Only leader, co-leader, or mentor can approve
    if (
      !club.leader.equals(userId) &&
      !club.coLeaders.includes(userId) &&
      !club.mentor.includes(userId)
    ) {
      throw new ApiError(403, "You are not authorized to approve applicants");
    }

    if (!club.appliedUsers.includes(applicantId)) {
      throw new ApiError(400, "User has not applied to this club");
    }

    // Remove from applicants and add to members
    club.appliedUsers = club.appliedUsers.filter(
      (uid) => uid.toString() !== applicantId
    );
    club.members.push(applicantId);
    await club.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200,"Applicant approved and added to members")
      );
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Something went wrong while approving the applicant"
        )
      );
  }
});

const rejectApplicants = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // clubId
    const { applicantId } = req.body;
    const userId = req.user._id;

    if (!applicantId) {
      throw new ApiError(400, "Applicant ID is required");
    }

    const club = await Club.findById(id);
    if (!club) {
      throw new ApiError(404, "Club not found");
    }

    // Only leader, co-leader, or mentor can reject
    if (
      !club.leader.equals(userId) &&
      !club.coLeaders.includes(userId) &&
      !club.mentor.includes(userId)
    ) {
      throw new ApiError(403, "You are not authorized to reject applicants");
    }

    if (!club.appliedUsers.includes(applicantId)) {
      throw new ApiError(400, "User has not applied to this club");
    }

    // Remove from applicants list
    club.appliedUsers = club.appliedUsers.filter(
      (uid) => uid.toString() !== applicantId
    );
    await club.save();

    return res
      .status(200)
      .json(new ApiResponse(200,"Applicant rejected successfully"));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Something went wrong while rejecting the applicant"
        )
      );
  }
});

const removeMember = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // club ID
    const { applicantId } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role; // to check if admin

    if (!applicantId) {
      throw new ApiError(400, "Member ID is required");
    }

    const club = await Club.findById(id);
    if (!club) {
      throw new ApiError(404, "Club not found");
    }

    const isLeader = club.leader.equals(userId);
    const isMentor = club.mentor.includes(userId);
    const isAdmin = userRole === "admin";

    if (!isLeader && !isMentor && !isAdmin) {
      throw new ApiError(
        403,
        "Only an Admin, Leader, or Mentor can remove members"
      );
    }

    // Prevent removing the leader
    if (club.leader.equals(applicantId)) {
      throw new ApiError(400, "Leader cannot be removed");
    }

    const wasCoLeader = club.coLeaders.includes(applicantId);
    const wasMember = club.members.includes(applicantId);

    if (!wasCoLeader && !wasMember) {
      throw new ApiError(400, "User is not a member or co-leader of the club");
    }

    // Remove user
    club.coLeaders = club.coLeaders.filter(
      (uid) => uid.toString() !== applicantId
    );
    club.members = club.members.filter((uid) => uid.toString() !== applicantId);

    await club.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        `User removed from ${
          wasCoLeader && wasMember
            ? "co-leaders and members"
            : wasCoLeader
            ? "co-leaders"
            : "members"
        } successfully`
      )
    );
  } catch (error) {
    return res.status(error.status || 500).json(
      new ApiResponse(
        error.status || 500,
        null,
        error.message || "Something went wrong while removing the user"
      )
    );
  }
});

const makeCoLeader = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // club ID
    const { applicantId } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!applicantId) {
      throw new ApiError(400, "User ID is required to make co-leader");
    }

    const club = await Club.findById(id);
    if (!club) {
      throw new ApiError(404, "Club not found");
    }

    const isLeader = club.leader.equals(userId);
    const isMentor = club.mentor.includes(userId);
    const isAdmin = userRole === "admin";

    if (!isLeader && !isMentor && !isAdmin) {
      throw new ApiError(
        403,
        "Only an Admin, Leader, or Mentor can assign Co-Leaders"
      );
    }

    // Prevent leader from being added as co-leader (redundant)
    if (club.leader.equals(applicantId)) {
      throw new ApiError(400, "Leader is already in charge");
    }

    // Check if user is already a co-leader
    const isAlreadyCoLeader = club.coLeaders.includes(applicantId);
    if (isAlreadyCoLeader) {
      throw new ApiError(400, "User is already a Co-Leader");
    }

    // Ensure the user is a member
    const isMember = club.members.includes(applicantId);
    if (!isMember) {
      throw new ApiError(400, "User must be a member before becoming a Co-Leader");
    }

    // Promote to co-leader
    club.coLeaders.push(applicantId);
    await club.save();

    return res
      .status(200)
      .json(new ApiResponse(200,"User promoted to Co-Leader successfully"));
  } catch (error) {
    return res.status(error.status || 500).json(
      new ApiResponse(
        error.status || 500,
        error.message || "Something went wrong while promoting to Co-Leader"
      )
    );
  }
});

const makeLeader = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // clubId
    const userId = req.user._id; // current user (request initiator)
    const userRole = req.user.role;
    const { applicantId } = req.body;

    if (!applicantId) {
      throw new ApiError(400, "User ID is required to make leader");
    }

    const club = await Club.findById(id);
    if (!club) {
      throw new ApiError(404, "Club not found");
    }

    const isLeader = club.leader.equals(userId);
    const isMentor = club.mentor.includes(userId);
    const isAdmin = userRole === "admin";

    if (!isLeader && !isMentor && !isAdmin) {
      throw new ApiError(
        403,
        "Only an Admin, Leader, or Mentor can assign Leader"
      );
    }

    // Prevent leader promotion if user is already leader
    if (club.leader.equals(applicantId)) {
      throw new ApiError(400, "User is already the Leader");
    }

    // Ensure the applicant is part of the club (member or co-leader)
    const isMember =
      club.members.includes(applicantId) ||
      club.coLeaders.includes(applicantId);

    if (!isMember) {
      throw new ApiError(
        400,
        "User must be a member or co-leader to become the Leader"
      );
    }

    // Transfer current leader to co-leader (optional logic)
    if (!club.coLeaders.includes(club.leader.toString())) {
      club.coLeaders.push(club.leader);
    }

    // Remove applicant from co-leaders if they're already there
    club.coLeaders = club.coLeaders.filter(
      (uid) => uid.toString() !== applicantId
    );

    //Remove applicant from the members if they're already there
    club.members = club.members.filter(
      (uid => uid.toString() !== applicantId)
    );

    // Promote new leader
    club.leader = applicantId;

    await club.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "User promoted to Leader successfully"));
  } catch (error) {
    return res.status(error.status || 500).json(
      new ApiResponse(
        error.status || 500,
        null,
        error.message || "Something went wrong while promoting to Leader"
      )
    );
  }
});

const removecoleader = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Club ID
    const { applicantId } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!applicantId) {
      throw new ApiError(400, "User ID is required");
    }

    const club = await Club.findById(id);
    if (!club) {
      throw new ApiError(404, "Club not found");
    }

    const isLeader = club.leader.equals(userId);
    const isMentor = club.mentor.includes(userId);
    const isAdmin = userRole === "admin";

    if (!isLeader && !isMentor && !isAdmin) {
      throw new ApiError(
        403,
        "Only an Admin, Leader, or Mentor can remove co-leaders"
      );
    }

    // Prevent removing the leader
    if (club.leader.equals(applicantId)) {
      throw new ApiError(400, "Leader cannot be removed");
    }

    const wasCoLeader = club.coLeaders.includes(applicantId);

    if (!wasCoLeader) {
      throw new ApiError(400, "User is not a Co-Leader of the club");
    }

    // Remove from co-leaders
    club.coLeaders = club.coLeaders.filter(
      (uid) => uid.toString() !== applicantId
    );

    await club.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        "User removed from Co-Leaders successfully"
      )
    );
  } catch (error) {
    return res.status(error.status || 500).json(
      new ApiResponse(
        error.status || 500,
        error.message || "Something went wrong while removing the Co-Leader"
      )
    );
  }
});

const updateDescription = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    

    const club = await Club.findById(id);
    if (!club) {
      throw new ApiError(404, "Club not found");
    }

    const isLeader = club.leader.equals(userId);
    const isMentor = club.mentor.includes(userId);
    const isAdmin = userRole === "admin";

    if (!isLeader && !isMentor && !isAdmin) {
      throw new ApiError(
        403,
        "Only an Admin, Leader, or Mentor can update the club description"
      );
    }

    club.description = description;
    await club.save();

    return res.status(200).json(
      new ApiResponse(200, "Description updated successfully", {
        description: club.description,
      })
    );
  } catch (error) {
    return res.status(error.status || 500).json(
      new ApiResponse(
        error.status || 500,
        error.message || "Something went wrong while updating description"
      )
    );
  }
});

const updateCoverImg = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const club = await Club.findById(id);
    if (!club) {
      throw new ApiError(404, "Club not found");
    }

    const isLeader = club.leader.equals(userId);
    const isMentor = club.mentor.includes(userId);
    const isAdmin = userRole === "admin";

    if (!isLeader && !isMentor && !isAdmin) {
      throw new ApiError(
        403,
        "Only an Admin, Leader, or Mentor can update the club Cover Image"
      );
    }

    const coverImgLocalPath = req.files?.coverimg?.[0]?.path;
    if (!coverImgLocalPath) {
      throw new ApiError(400, "Cover image file is required");
    }

    const uploadedImg = await uploadOnCloudinary(coverImgLocalPath, "image");
    if (!uploadedImg) {
      throw new ApiError(400, "Image upload failed or image is required");
    }

    club.coverimage = uploadedImg.secure_url;
    await club.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Cover image updated successfully", club));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(
        new ApiResponse(
          error.status || 500,
          error.message || "Something went wrong while updating cover image"
        )
      );
  }
});


const updateLogoImg = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const club = await Club.findById(id);
    if (!club) {
      throw new ApiError(404, "Club not found");
    }

    const isLeader = club.leader.equals(userId);
    const isMentor = club.mentor.includes(userId);
    const isAdmin = userRole === "admin";

    if (!isLeader && !isMentor && !isAdmin) {
      throw new ApiError(
        403,
        "Only an Admin, Leader, or Mentor can update the club Logo"
      );
    }

    const logoImgLocalPath = req.files?.logo?.[0]?.path;
    if (!logoImgLocalPath) {
      throw new ApiError(400, "Logo image file is required");
    }

    const uploadedImg = await uploadOnCloudinary(logoImgLocalPath, "image");
    if (!uploadedImg) {
      throw new ApiError(400, "Image upload failed or image is required");
    }

    club.logo = uploadedImg.secure_url;
    await club.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Logo updated successfully", club));
  } catch (error) {
    return res.status(error.status || 500).json(
      new ApiResponse(
        error.status || 500,
        error.message || "Something went wrong while updating logo"
      )
    );
  }
});












const getAllClubLeaders = asyncHandler(async (req, res) => {
  try {
    // Aggregate to group by leader and get only unique leaders
    const clubLeaders = await Club.aggregate([
      // Match all clubs
      {
        $match: {},
      },
      
      {
        $unwind: "$leader",
      },
      {
        $group: {
          _id: "$leader", 
        },
      },
     
      {
        $lookup: {
          from: "users", 
          localField: "_id", 
          foreignField: "_id",
          as: "leaderDetails",
        },
      },
      
      {
        $unwind: "$leaderDetails",
      },
      
      {
        $project: {
          _id: 0,
          leader: "$leaderDetails.fullName", 
        },
      },
    ]);

    // If no leaders are found
    if (!clubLeaders || clubLeaders.length === 0) {
      return res
        .status(404)
        .json({ message: "No distinct club leaders found" });
    }

    return res.status(200).json({
      success: true,
      leaders: clubLeaders,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

  
export {
  createClub,
  getClubDetails,
  getAllClubLeaders,
  getallclub,
  joinClub,
  leaveClub,
  getClubMember,
  getclubcoleader,
  getapplicants,
  approveApplicants,
  rejectApplicants,
  removeMember,
  makeCoLeader,
  makeLeader,
  removecoleader,
  updateDescription,
  updateCoverImg,
  updateLogoImg
  
};
