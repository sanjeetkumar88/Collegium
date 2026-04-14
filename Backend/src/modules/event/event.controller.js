import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import { User } from "../user/user.model.js";
import { Club } from "../club/club.model.js";
import { uploadOnCloudinary } from "../../shared/utils/cloudinary.js";
import { ApiResponse } from "../../shared/utils/ApiResponse.js";
import { Event } from "./event.model.js";
import mongoose from "mongoose";
import { sendMail } from "../../shared/utils/sendMail.js";

import QRCode from "qrcode";
import nodemailer from "nodemailer";

import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createEvents = asyncHandler(async (req, res) => {
  const { title, description, startDate, endDate, organiserName, organiserEmail, organiserPhone, clubId, category, language, price, maxParticipants } = req.body;

  if (!title || !startDate || !organiserName || !organiserEmail || !organiserPhone) {
    throw new ApiError(400, "Required fields are missing");
  }

  const imageLocalPath = req.file?.path;
  let imageUrl = "";

  if (imageLocalPath) {
    const uploadResult = await uploadOnCloudinary(imageLocalPath);
    imageUrl = uploadResult?.url || "";
  }

  const newEvent = await Event.create({
    title,
    description,
    startDate,
    endDate,
    organiser: {
      name: organiserName,
      email: organiserEmail,
      phone: organiserPhone,
    },
    club: clubId || null,
    category,
    language,
    price: price || 0,
    maxParticipants,
    image: imageUrl,
    createdBy: req.user._id,
  });

  return res.status(201).json(new ApiResponse(201, newEvent, "Event created successfully"));
});

const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: { $ne: "cancelled" } }).sort({ startDate: 1 });
  return res.status(200).json(new ApiResponse(200, events, "Events fetched successfully"));
});

const getEventDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id).populate("club", "name logo");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return res.status(200).json(new ApiResponse(200, event, "Event detail fetched successfully"));
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to delete this event");
  }

  event.status = "cancelled";
  await event.save();

  return res.status(200).json(new ApiResponse(200, null, "Event cancelled successfully"));
});

const editEvents = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to edit this event");
  }

  const updatedEvent = await Event.findByIdAndUpdate(id, { $set: updateData }, { new: true });

  return res.status(200).json(new ApiResponse(200, updatedEvent, "Event updated successfully"));
});

const registerUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
  
    const event = await Event.findById(id);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }
  
    if (event.status === "cancelled" || event.status === "completed") {
      throw new ApiError(400, "Event is no longer accepting registrations");
    }
  
    const isAlreadyRegistered = event.registeredUsers.some(reg => reg.user.toString() === userId.toString());
    if (isAlreadyRegistered) {
      throw new ApiError(400, "User already registered for this event");
    }
  
    if (event.maxParticipants && event.registeredUsers.length >= event.maxParticipants) {
      // Add to waitlist
      const isAlreadyWaitlisted = event.waitlist.some(w => w.user.toString() === userId.toString());
      if (isAlreadyWaitlisted) {
        throw new ApiError(400, "User already in waitlist");
      }
      event.waitlist.push({ user: userId });
      await event.save();
      return res.status(200).json(new ApiResponse(200, null, "Event is full. Added to waitlist."));
    }
  
    event.registeredUsers.push({ user: userId, registeredAt: new Date() });
    await event.save();
  
    return res.status(200).json(new ApiResponse(200, null, "Successfully registered for the event"));
  });

const registerUserWithPayment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { paymentId } = req.body;
    const userId = req.user._id;
  
    if(!paymentId) {
        throw new ApiError(400, "Payment ID is required");
    }

    const event = await Event.findById(id);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }
  
    const isAlreadyRegistered = event.registeredUsers.some(reg => reg.user.toString() === userId.toString());
    if (isAlreadyRegistered) {
      throw new ApiError(400, "User already registered for this event");
    }
  
    // In a real scenario, you'd verify paymentId with Razorpay here
  
    event.registeredUsers.push({ 
        user: userId, 
        paymentId, 
        paymentStatus: "completed",
        registeredAt: new Date() 
    });
    await event.save();
  
    return res.status(200).json(new ApiResponse(200, null, "Successfully registered with payment"));
});

const dashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const createdEventsCount = await Event.countDocuments({ createdBy: userId });
  const registeredEventsCount = await Event.countDocuments({ "registeredUsers.user": userId });
  
  return res.status(200).json(new ApiResponse(200, {
    createdEventsCount,
    registeredEventsCount
  }, "Dashboard data fetched"));
});

const getCreatedEvent = asyncHandler(async (req, res) => {
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
      const countPipeline = pipeline.filter(
        (stage) => !stage.$skip && !stage.$limit
      );
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

const getRsvps = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const { page = 1, limit = 10, title = "" } = req.query;

    const skip = (page - 1) * limit;

    const events = await Event.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          title: { $regex: title, $options: "i" },
        },
      },
      {
        $project: {
          title: 1,
          startDate: 1,
          endDate: 1,
          registeredCount: { $size: { $ifNull: ["$registeredUsers", []] } },
        },
      },
      { $sort: { startDate: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    const totalResult = await Event.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          title: { $regex: title, $options: "i" },
        },
      },
      { $count: "total" },
    ]);

    const total = totalResult[0]?.total || 0;

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: events,
    });
  } catch (error) {
    console.error("Error fetching RSVP counts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const { page = 1, limit = 10, title = "" } = req.query;

    const skip = (page - 1) * limit;

    const events = await Event.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          title: { $regex: title, $options: "i" },
        },
      },
      {
        $project: {
          title: 1,
          startDate: 1,
          endDate: 1,
          requestCount: { $size: { $ifNull: ["$waitlist", []] } },
        },
      },
      { $sort: { startDate: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    const totalResult = await Event.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          title: { $regex: title, $options: "i" },
        },
      },
      { $count: "total" },
    ]);

    const total = totalResult[0]?.total || 0;

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: events,
    });
  } catch (error) {
    console.error("Error fetching RSVP counts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getRegisteredUsers = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId)
      .populate("registeredUsers.user", "_id fullName username email avatar")
      .lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isCreator = event.createdBy?.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        message:
          "Access denied. Only the event creator or an admin can view registered users.",
      });
    }

    const users = event.registeredUsers.map(({ user }) => ({
      _id: user._id,
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

const downloadRegisteredUsersXLS = asyncHandler(async (req, res) => {
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
      return res
        .status(403)
        .json({
          message:
            "Access denied. Only the event creator or an admin can download this list.",
        });
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

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=registered_users_${eventId}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error downloading registered users XLS:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getWaitlistedUsers = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId)
      .populate("waitlist.user", "_id fullName username email avatar")
      .lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isCreator = event.createdBy?.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        message:
          "Access denied. Only the event creator or an admin can view the waitlist.",
      });
    }

    const users = (event.waitlist || []).map(({ user }) => ({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    }));

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching waitlisted users:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const downloadWaitlistedUsersXLS = asyncHandler(async (req, res) => {
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
      return res
        .status(403)
        .json({
          message:
            "Access denied. Only the event creator or an admin can download this list.",
        });
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

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=waitlisted_users_${eventId}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error downloading waitlisted users XLS:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateWaitlistStatus = asyncHandler(async (req, res) => {
  const { eventId, userId } = req.params;
  const { action } = req.body;
  const currentUserId = req.user._id;
  const userRole = req.user.role;

  if (
    !mongoose.Types.ObjectId.isValid(eventId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({ message: "Invalid event ID or user ID." });
  }

  if (!["accept", "reject"].includes(action)) {
    return res
      .status(400)
      .json({ message: "Invalid action. Must be 'accept' or 'reject'." });
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
    return res
      .status(403)
      .json({
        message:
          "Access denied. Only the event creator or an admin can update waitlist.",
      });
  }

  const waitlistEntry = event.waitlist.find(
    (entry) => entry.user._id.toString() === userId
  );

  if (!waitlistEntry) {
    return res.status(404).json({ message: "User not found in waitlist." });
  }

  const email = waitlistEntry.user.email;
  const fullName = waitlistEntry.user.fullName;

  try {
    const eventToUpdate = await Event.findById(eventId);

    // Remove from waitlist
    eventToUpdate.waitlist = eventToUpdate.waitlist.filter(
      (entry) => entry.user.toString() !== userId
    );

    if (action === "accept") {
      // Add to registered users
      eventToUpdate.registeredUsers.push({
        user: userId,
        registeredAt: new Date(),
      });

      await eventToUpdate.save();

      // Send acceptance email
      await sendMail({
        to: email,
        subject: "You're In! Event Registration Confirmed",
        html: `
          <p>Hello ${fullName},</p>
          <p>Congratulations! You have been moved from the waitlist to the registered participants list for the event: <strong>${event.title}</strong>.</p>
          <p>Thank you for your patience and welcome aboard!</p>
        `,
      });

      return res
        .status(200)
        .json({ message: "User accepted and notified via email." });
    }

    if (action === "reject") {
      await eventToUpdate.save();

      // Send rejection email
      await sendMail({
        to: email,
        subject: "Event Waitlist Update",
        html: `
          <p>Hello ${fullName},</p>
          <p>Unfortunately, your waitlist request for the event <strong>${event.title}</strong> was not approved.</p>
          <p>We hope to see you in future events.</p>
        `,
      });

      return res
        .status(200)
        .json({ message: "User rejected and notified via email." });
    }
  } catch (err) {
    console.error("Error processing waitlist update:", err);
    return res
      .status(500)
      .json({ message: "An error occurred while processing the request." });
  }
});

const downloadEventSummaryXLS = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate("registeredUsers.user", "username fullName email")
      .populate("waitlist.user", "username fullName email")
      .populate("createdBy", "_id");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const userId = req.user.id;
    const userRole = req.user.role;
    if (userRole !== "admin" && String(event.createdBy?._id) !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to download summary" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Event Summary");

    const headerStyle = {
      font: { bold: true, color: { argb: "FF000000" } },
      alignment: { horizontal: "center" },
    };

    const titleRow = worksheet.addRow([`Event Summary: ${event.title}`]);
    titleRow.font = { size: 16, bold: true };
    worksheet.addRow([]);

    worksheet.addRow([
      "Total Registered Users",
      (event.registeredUsers || []).length,
    ]);
    worksheet.addRow(["Total Waitlisted Users", (event.waitlist || []).length]);
    worksheet.addRow(["Max Capacity", event.maxCapacity || "N/A"]);
    worksheet.addRow([
      "Date",
      event.date
        ? new Date(event.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A",
    ]);
    worksheet.addRow([]);

    const regHeader = worksheet.addRow(["Registered Users"]);
    regHeader.font = { bold: true };
    worksheet.addRow([]);
    const regColumns = worksheet.addRow(["Username", "Name", "Email"]);
    regColumns.eachCell((cell) => (cell.style = headerStyle));

    (event.registeredUsers || []).forEach((entry) => {
      const user = entry.user;

      worksheet.addRow([
        user?.username || "N/A",
        user?.fullName || "N/A",
        user?.email || "N/A",
      ]);
    });

    worksheet.addRow([]);
    const waitHeader = worksheet.addRow(["Waitlisted Users"]);
    waitHeader.font = { bold: true };
    worksheet.addRow([]);
    const waitColumns = worksheet.addRow(["Username", "Name", "Email"]);
    waitColumns.eachCell((cell) => (cell.style = headerStyle));

    (event.waitlist || []).forEach((entry) => {
      const user = entry.user;
      worksheet.addRow([
        user?.username || "N/A",
        user?.fullName || "N/A",
        user?.email || "N/A",
      ]);
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

const removeMember = asyncHandler(async (req, res) => {
  try {
    const { eventId, memberId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (
      !mongoose.Types.ObjectId.isValid(eventId) ||
      !mongoose.Types.ObjectId.isValid(memberId)
    ) {
      return res.status(400).json({ message: "Invalid event ID or member ID" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isCreator = event.createdBy?.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isCreator && !isAdmin) {
      return res
        .status(403)
        .json({
          message:
            "Access denied. Only the event creator or an admin can remove members.",
        });
    }

    // Check if the member is actually registered in the event
    const isMember = event.registeredUsers.some(
      (user) => user.user.toString() === memberId
    );

    if (!isMember) {
      return res
        .status(404)
        .json({ message: "User not registered in this event" });
    }

    // Remove the member
    event.registeredUsers = event.registeredUsers.filter(
      (user) => user.user.toString() !== memberId
    );

    await event.save();

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { 
    createEvents, 
    getAllEvents, 
    getEventDetail, 
    deleteEvent, 
    editEvents,
    dashboard,
    getCreatedEvent,
    getRsvps,
    getRequest,
    getRegisteredUsers,
    downloadRegisteredUsersXLS,
    getWaitlistedUsers,
    downloadWaitlistedUsersXLS,
    updateWaitlistStatus,
    downloadEventSummaryXLS,
    removeMember,
    registerUser,
    registerUserWithPayment
};
