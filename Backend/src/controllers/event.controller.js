import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Club } from "../models/club.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Event } from "../models/event.model.js";
import mongoose from "mongoose";

import QRCode from "qrcode";
import nodemailer from "nodemailer";

import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateQrCode = async (userId, eventId) => {
  return `QR-${userId}-${eventId}`;
};

const createEvents = async (req, res) => {
  try {
    let {
      title,
      description,
      category,
      status,
      startDateTime,
      endDateTime,
      duration,
      acceptingRsvp,
      acceptingAttendance,
      maxParticipants,
      privacy,
      organiserName,
      organiserEmail,
      organiserPhone,
      price,
      language,
      tnc,
      adminNotes,
      medium,
      meet,
      location,
      clubId,
    } = req.body;

    const userId = req.user.id;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Basic validations
    if (
      !title ||
      !startDateTime ||
      !organiserName ||
      !organiserEmail ||
      !organiserPhone
    ) {
      throw new ApiError(400, "Required fields missing");
    }

    if (!emailRegex.test(organiserEmail)) {
      throw new ApiError(400, "Invalid organiser email");
    }

    // Phone number validation (10 digits only)
    if (!organiserPhone || organiserPhone.length !== 10) {
      throw new ApiError(400, "Invalid organiser phone number. Must be 10 digits");
    }

    // Club leader check
    if (clubId) {
      const club = await Club.findById(clubId);
      if (!club) throw new ApiError(404, "Club not found");

      const objectUserId = new mongoose.Types.ObjectId(userId);
      if (!club.leader.equals(objectUserId)) {
        throw new ApiError(
          403,
          "Only Club Leaders can create events for this club"
        );
      }
    }

    // Medium-based checks
    if (medium === "online" && (!Array.isArray(meet) || meet.length < 3)) {
      throw new ApiError(
        400,
        "For online events, meet must include [link, id, password]"
      );
    }

    if (medium === "offline" && (!Array.isArray(location) || location.length < 3)) {
      throw new ApiError(
        400,
        "For offline events, location must include [venue, lat, lng]"
      );
    }

    // Safe defaults
    if (price < 0 || !price) price = 0;
    if (maxParticipants < 0) maxParticipants = 0;

    // Handle image upload
    const imagePath = req.file?.path;
    let imageUrl = "";
    if (imagePath) {
      const uploadedImage = await uploadOnCloudinary(imagePath, "image");
      if (!uploadedImage?.secure_url) {
        throw new ApiError(400, "Image upload to Cloudinary failed");
      }
      imageUrl = uploadedImage.secure_url;
    }

    // Construct new event
    const newEvent = new Event({
      title,
      description,
      category,
      status,
      startDate: new Date(startDateTime),
      endDate: endDateTime ? new Date(endDateTime) : undefined,
      duration,
      acceptingRsvp,
      acceptingAttendance,
      maxParticipants,
      privacy,
      organiser: {
        name: organiserName,
        email: organiserEmail,
        phone: organiserPhone,
      },
      price,
      image: imageUrl,
      language,
      tnc,
      adminNotes,
      medium,
      meet: medium === "online" ? meet : [],
      location: medium === "offline" ? location : [],
      club: clubId || null,
      createdBy: userId,
    });

    // Manual validation to catch Mongoose errors
    const validationError = newEvent.validateSync();
    if (validationError) throw validationError;

    await newEvent.save();

    return res
      .status(201)
      .json(new ApiResponse(201, newEvent, "Event created successfully"));
  } catch (error) {
    console.error("Create Event Error:", error);

    let statusCode = error.statusCode || 500;
    let message = error.message || "Event creation failed";

    // Handling ApiError explicitly
    if (error instanceof ApiError) {
      return res.status(statusCode).json(new ApiResponse(statusCode, null, message));
    }

    // Handle Mongoose ValidationError
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json(new ApiResponse(400, null, "Validation failed", errors));
    }

    // Catch any unhandled error
    return res.status(statusCode).json(new ApiResponse(statusCode, null, message));
  }
};


const getAllEvents = async (req, res) => {
  try {
    const {
      title = "",
      category,
      privacy,
      medium,
      participationStatus,
      page = 1,
      limit = 10,

    } = req.query;

    const userId = req.user?._id;
    const now = new Date(); // Current time as Date object
    const skip = (page - 1) * limit;

    const filters = {
      ...(title && { title: { $regex: title, $options: "i" } }),
      ...(category && { category }),
      ...(privacy && { privacy }),
      ...(medium && { medium }),
    };

    const pipeline = [
      { $match: filters },

      // Add dynamic status based on startDate and endDate
      {
        $addFields: {
          status: {
            $switch: {
              branches: [
                { case: { $gt: ["$startDate", now] }, then: "upcoming" },
                {
                  case: {
                    $and: [
                      { $lte: ["$startDate", now] },
                      { $gte: ["$endDate", now] },
                    ],
                  },
                  then: "ongoing",
                },
              ],
              default: "completed",
            },
          },
        },
      },

      // Keep only upcoming and ongoing events
      {
        $match: {
          status: { $in: ["upcoming", "ongoing"] },
        },
      },

      // Add participation status (joined/requested/not-joined)
      {
        $addFields: {
          userStatus: userId
            ? {
                $cond: [
                  {
                    $in: [new mongoose.Types.ObjectId(userId), "$registeredUsers.user"],
                  },
                  "joined",
                  {
                    $cond: [
                      {
                        $in: [new mongoose.Types.ObjectId(userId), "$invitedUsers"],
                      },
                      "requested",
                      "not-joined",
                    ],
                  },
                ],
              }
            : "not-joined",
        },
      },

      // Optional filter by user participation status
      ...(participationStatus ? [{ $match: { userStatus: participationStatus } }] : []),

      // Select only required fields
      {
        $project: {
          title: 1,
          image: 1,
          startDate: 1,
          endDate: 1,  // Include endDate if you want to use it later in the client
          category: 1,
        },
      },

      { $sort: { startDate: 1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ];

    const events = await Event.aggregate(pipeline);

    // Count total (without skip & limit)
    const countPipeline = pipeline.filter(stage => !stage.$skip && !stage.$limit);
    countPipeline.push({ $count: "total" });
    const totalResult = await Event.aggregate(countPipeline);
    const total = totalResult[0]?.total || 0;

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: events,
    });
  } catch (err) {
    console.error("Error fetching filtered events:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getEventDetail = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  

  
  if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    
    const event = await Event.findById(eventId).populate("createdBy", "name email _id");

    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }


    
    
    const response = {
      _id:event._id,
      clubId: event.clubId,
      title: event.title,
      description: event.description,
      category: event.category,
      status: event.status,
      startDateTime: event.startDate,
      endDateTime: event.endDate,
      duration: event.duration,
      acceptingRsvp: event.acceptingRsvp,
      acceptingAttendance: event.acceptingAttendance,
      maxParticipants: event.maxParticipants,
      privacy: event.privacy,
      organiserName: event.organiser.name,
      organiserEmail: event.organiser.email,
      organiserPhone: event.organiser.phone,
      price: event.price,
      language: event.language,
      tnc: event.tnc,
      adminNotes: event.adminNotes,
      medium: event.medium,
      meet: event.meet, // [link, id, password]
      location: event.location, // [venue, latitude, longitude]
      image: event.image,
      createdBy: event.createdBy, // populated user object
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error(error);  // Log the error for debugging
    // Return a 500 server error if any unexpected error occurs
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
});


const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  // Only admin or event creator can delete
  if (
    req.user.role !== "admin" &&
    event.createdBy.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this event");
  }

  await event.deleteOne();
  res.status(200).json({ message: "Event deleted successfully" });
});

const editEvents = async (req, res) => {
  try {
    let {
      title,
      description,
      category,
      status,
      startDateTime,
      endDateTime,
      duration,
      acceptingRsvp,
      acceptingAttendance,
      maxParticipants,
      privacy,
      organiserName,
      organiserEmail,
      organiserPhone,
      price,
      language,
      tnc,
      adminNotes,
      medium,
      meet,
      location,
      clubId,
    } = req.body;

    const eventId = req.params.id;
    const userId = req.user._id;

    // Validate required fields
    if (!title || !startDateTime || !organiserName || !organiserEmail || !organiserPhone) {
      throw new ApiError(400, "Required fields missing");
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) throw new ApiError(404, "Event not found");

    // Authorization check
    if (req.user.role !== "admin" && event.createdBy.toString() !== userId.toString()) {
      throw new ApiError(403, "Not authorized to edit this event");
    }

    // Validate club and leadership
    if (clubId) {
      const club = await Club.findById(clubId);
      if (!club) throw new ApiError(404, "Club not found");

      const objectUserId = new mongoose.Types.ObjectId(userId);
      if (!club.leader.equals(objectUserId)) {
        throw new ApiError(403, "Only Club Leaders can create/edit events for this club");
      }

      event.club = clubId;
    }

    // Medium-specific validation
    if (medium === "online") {
      if (!Array.isArray(meet) || meet.length < 3) {
        throw new ApiError(400, "For online events, meet must include [link, id, password]");
      }
      event.meet = meet;
      event.location = [];
    } else if (medium === "offline") {
      if (!Array.isArray(location) || location.length < 3) {
        throw new ApiError(400, "For offline events, location must include [venue, lat, lng]");
      }
      event.location = location;
      event.meet = [];
    }

    if(price < 0 || !price){
      price = 0;
    }
    if(maxParticipants <0 || !maxParticipants){
      maxParticipants = 0;
    }

    // Update fields
    event.title = title;
    event.description = description;
    event.category = category;
    event.status = status;
    event.startDate = new Date(startDateTime);
    event.endDate = endDateTime ? new Date(endDateTime) : undefined;
    event.duration = duration;
    event.acceptingRsvp = acceptingRsvp === "true" || acceptingRsvp === true;
    event.acceptingAttendance = acceptingAttendance === "true" || acceptingAttendance === true;
    event.maxParticipants = maxParticipants;
    event.privacy = privacy;
    event.organiser = {
      name: organiserName,
      email: organiserEmail,
      phone: organiserPhone,
    };
    event.price = price;
    event.language = language;
    event.tnc = tnc;
    event.adminNotes = adminNotes;
    event.medium = medium;

    await event.save();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Edit Event Error:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message || "Something went wrong" });
  }
};

export const registerUser = async (req, res) => {
  const eventId  = req.params.id;
  const userId = req.user._id;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.acceptingRsvp) {
      return res.status(400).json({ message: "RSVP is closed for this event." });
    }

    const alreadyRegistered = event.registeredUsers.some(
      (entry) => entry.user.toString() === userId.toString()
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: "User already registered." });
    }

    const alreadyWaitlisted = event.waitlist.some(
      (entry) => entry.user.toString() === userId.toString()
    );
    if (alreadyWaitlisted) {
      return res.status(400).json({ message: "User already in waitlist." });
    }

    const isUnlimited = event.maxParticipants == null;
    const hasSpace = isUnlimited || event.registeredUsers.length < event.maxParticipants;
    const isFree = !event.price || event.price === 0;

    if (isFree) {
      if (hasSpace) {
        if (event.privacy === "private") {
          event.waitlist.push({ user: userId });
        } else {
          const qrCode = event.acceptingAttendance
            ? await generateQrCode(userId, event._id)
            : null;

          event.registeredUsers.push({
            user: userId,
            paymentId: null,
            paymentStatus: "completed",
            qrCode,
            registeredAt: new Date(),
          });
        }
      } else {
        event.waitlist.push({ user: userId });
      }
    } else {
      return res.status(400).json({ message: "This event requires payment. Use payment route." });
    }

    await event.save();

    return res.status(200).json({
      message: "User registration handled successfully.",
      status: isFree
        ? hasSpace
          ? event.privacy === "private"
            ? "waitlisted (private)"
            : "registered"
          : "waitlisted (full)"
        : "payment required",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const registerUserWithPayment = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;
  const { paymentId, paymentStatus } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.acceptingRsvp) {
      return res.status(400).json({ message: "RSVP is closed for this event." });
    }

    if (!event.price || event.price === 0) {
      return res.status(400).json({ message: "This event is free. Use the free registration route." });
    }

    const alreadyRegistered = event.registeredUsers.some(
      (entry) => entry.user.toString() === userId.toString()
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: "User already registered." });
    }

    const alreadyWaitlisted = event.waitlist.some(
      (entry) => entry.user.toString() === userId.toString()
    );
    if (alreadyWaitlisted) {
      return res.status(400).json({ message: "User already in waitlist." });
    }

    const isUnlimited = event.maxParticipants == null;
    const hasSpace = isUnlimited || event.registeredUsers.length < event.maxParticipants;

    if (!hasSpace) {
      return res.status(400).json({ message: "Event is full. Cannot register." });
    }

    if (paymentStatus !== "completed") {
      return res.status(400).json({ message: "Payment not completed." });
    }

    const qrCode = event.acceptingAttendance
      ? await generateQrCode(userId, event._id)
      : null;

    event.registeredUsers.push({
      user: userId,
      paymentId,
      paymentStatus,
      qrCode,
      registeredAt: new Date(),
    });

    await event.save();

    return res.status(200).json({
      message: "User successfully registered with payment.",
      status: "registered",
    });
  } catch (error) {
    console.error("Error registering user with payment:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const dashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const now = new Date();

    const result = await Event.aggregate([
      {
        $match: {
          createdBy: userId,
           
        }
      },
      {
        $facet: {
          total: [{ $count: "count" }],
          private: [
            { $match: { privacy: "private" } },
            { $count: "count" }
          ],
          public: [
            { $match: { privacy: "public" } },
            { $count: "count" }
          ],
          online: [
            { $match: { medium: "online" } },
            { $count: "count" }
          ],
          offline: [
            { $match: { medium: "offline" } },
            { $count: "count" }
          ]
        }
      }
    ]);

    const data = result[0];

    const response = {
      total: data.total[0]?.count || 0,
      private: data.private[0]?.count || 0,
      public: data.public[0]?.count || 0,
      online: data.online[0]?.count || 0,
      offline: data.offline[0]?.count || 0,
    };

    res.status(200).json(response);

  } catch (error) {
    console.error("Error in fetching data", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export const getCreatedEvent = asyncHandler(async (req, res) => {
  try {
    const {
      title = "",
      category,
      privacy,
      medium,
      status, // "upcoming" | "ongoing" | "completed"
      page = 1,
      limit = 10,
    } = req.query;

    const userId = req.user?._id;
    const now = new Date();
    const skip = (page - 1) * limit;

    // Base filters
    const filters = {
      ...(title && { title: { $regex: title, $options: "i" } }),
      ...(category && { category }),
      ...(privacy && { privacy }),
      ...(medium && { medium }),
      ...(userId && { createdBy: userId }),
    };

    const pipeline = [
      { $match: filters },

      // Compute event status dynamically
      {
        $addFields: {
          status: {
            $switch: {
              branches: [
                { case: { $gt: ["$startDate", now] }, then: "upcoming" },
                {
                  case: {
                    $and: [
                      { $lte: ["$startDate", now] },
                      { $gte: ["$endDate", now] },
                    ],
                  },
                  then: "ongoing",
                },
              ],
              default: "completed",
            },
          },
        },
      },

      // Optional status filter
      ...(status ? [{ $match: { status } }] : []),

      // Project only required fields
      {
        $project: {
          title: 1,
          image: 1,
          startDate: 1,
          endDate: 1,
          category: 1,
          status: 1,
        },
      },

      { $sort: { startDate: 1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ];

    const events = await Event.aggregate(pipeline);

    // Total count for pagination
    const countPipeline = pipeline.filter(stage => !stage.$skip && !stage.$limit);
    countPipeline.push({ $count: "total" });
    const totalResult = await Event.aggregate(countPipeline);
    const total = totalResult[0]?.total || 0;

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const getRsvps = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const {
      page = 1,
      limit = 10,
      title = "",
    } = req.query;

    const skip = (page - 1) * limit;

    const events = await Event.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          title: { $regex: title, $options: "i" },
        }
      },
      {
        $project: {
          title: 1,
          startDate: 1,
          endDate: 1,
          registeredCount: { $size: { $ifNull: ["$registeredUsers", []] } }
        }
      },
      { $sort: { startDate: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) }
    ]);

    const totalResult = await Event.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          title: { $regex: title, $options: "i" },
        }
      },
      { $count: "total" }
    ]);

    const total = totalResult[0]?.total || 0;

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: events
    });

  } catch (error) {
    console.error("Error fetching RSVP counts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const getRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const {
      page = 1,
      limit = 10,
      title = "",
    } = req.query;

    const skip = (page - 1) * limit;

    const events = await Event.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          title: { $regex: title, $options: "i" },
        }
      },
      {
        $project: {
          title: 1,
          startDate: 1,
          endDate: 1,
          requestCount: { $size: { $ifNull: ["$waitlist", []] } }
        }
      },
      { $sort: { startDate: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) }
    ]);

    const totalResult = await Event.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          title: { $regex: title, $options: "i" },
        }
      },
      { $count: "total" }
    ]);

    const total = totalResult[0]?.total || 0;

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: events
    });

  } catch (error) {
    console.error("Error fetching RSVP counts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const getRegisteredUsers = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId)
      .populate("registeredUsers.user", "fullName username email avatar")
      .lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isCreator = event.createdBy?.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Access denied. Only the event creator or an admin can view registered users." });
    }

    const users = event.registeredUsers.map(({ user }) => ({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    }));

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching registered users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DOWNLOAD Registered Users XLS
export const downloadRegisteredUsersXLS = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId)
      .populate("registeredUsers.user", "fullName username email")
      .lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isCreator = event.createdBy?.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Access denied. Only the event creator or an admin can download this list." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Registered Users");

    worksheet.columns = [
      { header: "Full Name", key: "fullName", width: 25 },
      { header: "Username", key: "username", width: 20 },
      { header: "Email", key: "email", width: 30 },
    ];

    event.registeredUsers.forEach(({ user }) => {
      worksheet.addRow({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=registered_users_${eventId}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error downloading registered users XLS:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET Waitlisted Users
export const getWaitlistedUsers = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId)
      .populate("waitlist.user", "fullName username email avatar")
      .lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isCreator = event.createdBy?.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Access denied. Only the event creator or an admin can view waitlist." });
    }

    const users = event.waitlist.map(({ user }) => ({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    }));

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching waitlisted users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DOWNLOAD Waitlisted Users XLS
export const downloadWaitlistedUsersXLS = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId)
      .populate("waitlist.user", "fullName username email")
      .lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isCreator = event.createdBy?.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Access denied. Only the event creator or an admin can download this list." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Waitlisted Users");

    worksheet.columns = [
      { header: "Full Name", key: "fullName", width: 25 },
      { header: "Username", key: "username", width: 20 },
      { header: "Email", key: "email", width: 30 },
    ];

    event.waitlist.forEach(({ user }) => {
      worksheet.addRow({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=waitlisted_users_${eventId}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error downloading waitlisted users XLS:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const updateWaitlistStatus = asyncHandler(async (req, res) => {
  const { eventId, userId } = req.params;
  const { action } = req.body;
  const currentUserId = req.user._id;
  const userRole = req.user.role;

  if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid event ID or user ID." });
  }

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action. Must be 'accept' or 'reject'." });
  }

  const event = await Event.findById(eventId)
    .populate("waitlist.user", "email fullName")
    .lean();

  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  const isCreator = event.createdBy?.toString() === currentUserId.toString();
  const isAdmin = userRole === "admin";

  if (!isCreator && !isAdmin) {
    return res.status(403).json({ message: "Access denied. Only the event creator or an admin can update waitlist." });
  }

  const waitlistEntry = event.waitlist.find(entry => entry.user._id.toString() === userId);
  if (!waitlistEntry) {
    return res.status(404).json({ message: "User not found in waitlist." });
  }

  const email = waitlistEntry.user.email;
  const fullName = waitlistEntry.user.fullName;

  try {
    const eventToUpdate = await Event.findById(eventId);

    // Remove from waitlist
    eventToUpdate.waitlist = eventToUpdate.waitlist.filter(entry => entry.user.toString() !== userId);

    if (action === "accept") {
      eventToUpdate.registeredUsers.push({ user: userId, registeredAt: new Date() });

      await eventToUpdate.save();

      // Send acceptance email
      await transporter.sendMail({
        from: `"Event Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "You're In! Event Registration Confirmed",
        html: `
          <p>Hello ${fullName},</p>
          <p>Congratulations! You've been moved from the waitlist to the registered participants list for the event: <strong>${event.title}</strong>.</p>
          <p>Thank you for your patience!</p>
        `,
      });

      return res.status(200).json({ message: "User accepted and notified via email." });
    }

    if (action === "reject") {
      await eventToUpdate.save();

      // Send rejection email
      await transporter.sendMail({
        from: `"Event Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Event Waitlist Update",
        html: `
          <p>Hello ${fullName},</p>
          <p>Unfortunately, your waitlist request for the event <strong>${event.title}</strong> was not approved.</p>
          <p>We hope to see you in a future event.</p>
        `,
      });

      return res.status(200).json({ message: "User rejected and notified via email." });
    }

  } catch (err) {
    console.error("Error processing waitlist update:", err);
    return res.status(500).json({ message: "An error occurred while processing the request." });
  }
});

export const downloadEventSummaryXLS = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Fetch event with creator field
    const event = await Event.findById(eventId)
      .populate("registeredUsers.userId", "name email")
      .populate("waitlistedUsers.userId", "name email")
      .populate("createdBy", "_id"); // ensure createdBy is accessible

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Authorization check
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== "admin" && String(event.createdBy?._id) !== userId) {
      return res.status(403).json({ message: "Unauthorized to download summary" });
    }

    const ExcelJS = await import("exceljs"); // dynamic import for ESM compatibility
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Event Summary");

    // Title
    worksheet.addRow([`Event Summary: ${event.title}`]);
    worksheet.addRow([]);

    // Stats
    worksheet.addRow(["Total Registered Users", event.registeredUsers.length]);
    worksheet.addRow(["Total Waitlisted Users", event.waitlistedUsers.length]);
    worksheet.addRow(["Max Capacity", event.maxCapacity || "N/A"]);
    worksheet.addRow(["Date", event.date?.toDateString() || "N/A"]);
    worksheet.addRow([]);

    // Registered Users
    worksheet.addRow(["Registered Users"]);
    worksheet.addRow(["Name", "Email"]);
    event.registeredUsers.forEach((entry) => {
      const user = entry.userId;
      worksheet.addRow([user?.name || "N/A", user?.email || "N/A"]);
    });

    // Waitlisted Users
    worksheet.addRow([]);
    worksheet.addRow(["Waitlisted Users"]);
    worksheet.addRow(["Name", "Email"]);
    event.waitlistedUsers.forEach((entry) => {
      const user = entry.userId;
      worksheet.addRow([user?.name || "N/A", user?.email || "N/A"]);
    });

    worksheet.columns.forEach((col) => (col.width = 30));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=event-summary-${event._id}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error generating event summary XLS:", err);
    res.status(500).json({ message: "Failed to generate event summary." });
  }
};












 
 
export {
  createEvents,
  getAllEvents,
  getEventDetail,
  deleteEvent,
  editEvents,

};
