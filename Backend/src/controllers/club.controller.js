import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Club } from "../models/club.model.js";

const createClub = asyncHandler(async (req, res) => {
  try {
    const { name, description,leader, mentor } = req.body;

    if([name,description,leader,mentor].some((field) => field?.trim() === "")){
        throw new ApiError(400,"All fields are required");
    }

    const existedClub = await Club.findOne({name});

    if(existedClub){
        throw new ApiError(409,"Club name is already takened");
    }  

    const club = await Club.create({
        name,
        description,
        leader,
        mentor
    });

    const createdClub = await Club.findById(club._id);

    if(!createdClub){
        throw new ApiError(500,"Something wents wrong while creating the club");
    }
 
    return res.
    status(201).
    json(new ApiResponse(200,createdClub,"Club is created successfully"));

  } catch (error) {
    throw new ApiError(500,error);
  }
});

const getAllClubsForTeacherAndAdmin = asyncHandler(async (req, res) => {
    try {
        const { tags, name, page = 1, limit = 10 } = req.query;
        // const userId = req.user.id;
        const userId = '67bb36f367ca63af5466cebc';
        
        let filter = { is_deleted: false };

        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        if (tags) {
            filter.tags = { $regex: tags, $options: "i" };
        }

        let pageNumber = parseInt(page, 10);
        let pageSize = parseInt(limit, 10);
        let skip = (pageNumber - 1) * pageSize;

        const clubs = await Club.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .select("_id coverimage logo description name tags members appliedUsers");

        // Modify each club to include the user's membership status
        const clubsWithStatus = clubs.map(club => {
            let status = "Apply";
            if (club.members.includes(userId)) {
                status = "Joined";
            } else if (club.appliedUsers && club.appliedUsers.includes(userId)) {
                status = "Applied";
            }

            return {
                _id:club._id,
                coverimage: club.coverimage,
                logo: club.logo,
                description: club.description,
                name: club.name,
                tags: club.tags,
                status,
            };
        });

        const totalClubs = await Club.countDocuments(filter);

        return res.status(200).json(
            new ApiResponse(200, {
                clubs: clubsWithStatus,
                totalPages: Math.ceil(totalClubs / pageSize),
                currentPage: pageNumber,
            }, "Clubs fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while fetching the clubs");
    }
});

const getallclub = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id; // Student's ID
        const { page = 1, limit = 10 } = req.query;

        let pageNumber = parseInt(page, 10);
        let pageSize = parseInt(limit, 10);
        let skip = (pageNumber - 1) * pageSize;

        // Fetch public clubs and private clubs where the student is a member
        const filter = {
            $or: [
                { visibility: "public", is_deleted: false },
                { visibility: "private", members: userId, is_deleted: false }
            ]
        };

        const clubs = await Club.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .select("_id coverimage logo description name tags visibility members");

        // Add membership status
        
        
        const clubsWithStatus = clubs.map(club => ({
            _id:club._id,
            coverimage: club.coverimage,
            logo: club.logo,
            description: club.description,
            name: club.name,
            tags: club.tags,
            visibility: club.visibility,
            status: club.members.includes(userId) ? "Joined" : "Apply"
        }));

        const totalClubs = await Club.countDocuments(filter);

        return res.status(200).json(
            new ApiResponse(200, {
                clubs: clubsWithStatus,
                totalPages: Math.ceil(totalClubs / pageSize),
                currentPage: pageNumber,
            }, "Clubs fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while fetching clubs");
    }
});

const getprivateclub = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id; // Student's ID
        const { page = 1, limit = 10 } = req.query;

        let pageNumber = parseInt(page, 10);
        let pageSize = parseInt(limit, 10);
        let skip = (pageNumber - 1) * pageSize;

        const filter = { visibility: "private", members: userId, is_deleted: false };

        // Run both queries in parallel for better performance
        const [clubs, totalClubs] = await Promise.all([
            Club.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .select("coverimage logo description name tags visibility members"),
            Club.countDocuments(filter),
        ]);

        // Add membership status (always "Joined" since the user is a member)
        const clubsWithStatus = clubs.map(club => ({
            coverimage: club.coverimage,
            logo: club.logo,
            description: club.description,
            name: club.name,
            tags: club.tags,
            visibility: club.visibility,
            status: "Joined",
        }));

        return res.status(200).json(
            new ApiResponse(200, {
                clubs: clubsWithStatus,
                totalPages: Math.ceil(totalClubs / pageSize),
                currentPage: pageNumber,
            }, "Private clubs fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while fetching private clubs");
    }
});

const getAllJoinedClubs = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id; // Student's ID
        const { page = 1, limit = 10 } = req.query;

        let pageNumber = parseInt(page, 10);
        let pageSize = parseInt(limit, 10);
        let skip = (pageNumber - 1) * pageSize;

        const filter = { members: userId, is_deleted: false }; // Fetch all joined clubs

        // Run both queries in parallel for better performance
        const [clubs, totalClubs] = await Promise.all([
            Club.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .select("coverimage logo description name tags visibility"),
            Club.countDocuments(filter),
        ]);

        // Add "Joined" status to each club
        const clubsWithStatus = clubs.map(club => ({
            coverimage: club.coverimage,
            logo: club.logo,
            description: club.description,
            name: club.name,
            tags: club.tags,
            visibility: club.visibility, // Helps frontend differentiate public/private
            status: "Joined",
        }));

        return res.status(200).json(
            new ApiResponse(200, {
                clubs: clubsWithStatus,
                totalPages: Math.ceil(totalClubs / pageSize),
                currentPage: pageNumber,
            }, "Joined clubs fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while fetching joined clubs");
    }
});

const leaveClub = asyncHandler(async (req, res) => {
    try {
        const { clubId } = req.params;
        const userId = req.user.id;

        const club = await Club.findById(clubId);
        if (!club) throw new ApiError(404, "Club not found");

        if (club.leader.equals(userId)) {
            throw new ApiError(400, "Leader cannot leave the club. Transfer leadership first.");
        }

        club.members = club.members.filter(id => id.toString() !== userId);
        await club.save();

        return res.status(200).json(new ApiResponse(200, null, "Successfully left the club"));
    } catch (error) {
        throw new ApiError(500, error.message || "Error leaving the club");
    }
});

const getPendingApplications = asyncHandler(async (req, res) => {
    try {
        const { clubId } = req.params;

        const club = await Club.findById(clubId)
            .populate("appliedUsers", "name email"); // Populate user details

        if (!club) throw new ApiError(404, "Club not found");

        // Ensure only club leaders/admins can access
        if (req.user.role !== "admin" && !club.leader.equals(req.user.id)) {
            throw new ApiError(403, "Unauthorized to view pending applications");
        }

        return res.status(200).json(new ApiResponse(200, club.appliedUsers, "Pending applications fetched successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Error fetching pending applications");
    }
});

const getClubDetails = asyncHandler(async (req, res) => {
    try {
        // Get the clubId from request parameters
        const { id } = req.params;
        // const clubId = '67e1314319a2bcd2819f9a4d';
        console.log(req.params);
        

        if (!id) {
            return res.status(400).json({ message: "Club ID is required" });
        }

        // Attempt to find the club by its ID
        const club = await Club.findById(id)
            .populate("mentor", "fullName")
            .populate("leader", "fullName");

        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }
        

        // Constructing the response with the relevant details
        return res.status(200).json({
            _id: club._id,
            logo: club.logo,
            coverImg: club.coverimage,
            name: club.name,
            status: club.status,
            leader: club.leader ? club.leader.fullName : "N/A", // Assuming leader is populated with fullName
            mentor: club.mentor ? club.mentor.map(m => m.fullName).join(", ") : "N/A", // Assuming mentor is an array
            totalMembers: club.members.length,
            visibility: club.visibility,
            tags: club.tags,
            description: club.description
        });
    } catch (error) {
        // Catch and handle any unexpected errors
        console.error(error);  // Log the error for debugging purposes
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
});









export {
    getAllClubsForTeacherAndAdmin,
    createClub,
    getClubDetails,
}
