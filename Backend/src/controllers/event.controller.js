import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Club } from "../models/club.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Event } from "../models/event.model.js";



import QRCode from "qrcode";
import nodemailer from "nodemailer";

import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createEvents = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      duration,
      medium,
      meet = [],
      location = [],
      image,
      acceptingRsvp,
      acceptingAttendance,
      maxParticipants,
      privacy,
      isExternalOrganiser,
      organiser,
      externalOrganiserInfo,
      club,
      invitedUsers,
      price,
      category,
      language,
      tnc,
      adminNotes,
      createdBy,
    } = req.body;

    // Input validation
    if (!title || !startDate) {
      return res
        .status(400)
        .json({ message: "Title and startDate are required." });
    }

    if (isExternalOrganiser) {
      if (
        !externalOrganiserInfo?.name ||
        !externalOrganiserInfo?.email ||
        !externalOrganiserInfo?.phone
      ) {
        return res.status(400).json({
          message: "External organiser must have name, email, and phone.",
        });
      }
    } else {
      if (!organiser) {
        return res
          .status(400)
          .json({ message: "Internal organiser is required." });
      }
      const foundUser = await User.findById(organiser);

      if (!foundUser) {
        return res.status(404).json({ message: "Organiser user not found." });
      }
    }

    if (club) {
      const foundClub = await Club.findById(club);
      if (!foundClub) {
        return res.status(404).json({ message: "Club not found." });
      }
    }

    const newEvent = await Event.create({
      title,
      description,
      startDate,
      endDate,
      duration,
      medium,
      meet,
      location,
      image,
      acceptingRsvp,
      acceptingAttendance,
      maxParticipants,
      privacy,
      isExternalOrganiser,
      organiser: isExternalOrganiser ? undefined : organiser,
      externalOrganiserInfo: isExternalOrganiser
        ? externalOrganiserInfo
        : undefined,
      club,
      invitedUsers,
      price,
      category,
      language,
      tnc,
      adminNotes,
      createdBy: "67e1306319a2bcd2819f9a3f",
    });

    const createdEvent = await Event.findById(newEvent._id);

    res
      .status(201)
      .json({ message: "Event created successfully", event: createdEvent });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


const showEvents = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      category,
      page,
      limit,
      medium,
      privacy,
      club,
      status,
      startDate,
      endDate,
    } = req.query;

    const filter = {};

    if (name) {
      filter.title = { $regex: name, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (privacy) {
      filter.privacy = privacy;
    }

    if (medium) {
      filter.medium = medium;
    }

    if (club) {
      filter.club = club;
    }

    if (status) {
      filter.status = status;
    }

    // 🗓️ Date range filter
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) {
        filter.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.startDate.$lte = new Date(endDate);
      }
    }

    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalEvents = await Event.countDocuments(filter);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          events,
          totalPages: Math.ceil(totalEvents / pageSize),
          currentPage: pageNumber,
        },
        "Events fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to fetch Events");
  }
});

const getSingleEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id)
    .populate("organiser", "name email")
    .populate("club", "name")
    .populate("invitedUsers", "name email");

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.status(200).json(new ApiResponse(200, event, "Event details fetched"));
});


const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedEvent = await Event.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedEvent) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.status(200).json(new ApiResponse(200, updatedEvent, "Event updated successfully"));
});

const registerUserToEvent = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
      return res.status(404).json({ message: "Event or User not found" });
    }

    const alreadyRegistered = event.registeredUsers.find(r => r.user.toString() === userId.toString());
    if (alreadyRegistered) {
      return res.status(400).json({ message: "User already registered for this event" });
    }

    const registration = {
      user: userId,
      paymentStatus: event.price > 0 ? "pending" : "completed",
      registeredAt: new Date(),
    };

    // Generate QR Code
    const qrData = `Event: ${event.title}\nName: ${user.fullName}\nUsername: ${user.username}\nEmail: ${user.email}`;
    const qrImage = await QRCode.toDataURL(qrData);
    registration.qrCode = qrImage;

    event.registeredUsers.push(registration);
    await event.save();

    // Send Email with QR
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Event Portal" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Registration Confirmed: ${event.title}`,
      html: `<h3>Hello ${user.fullName},</h3>
             <p>You have successfully registered for <strong>${event.title}</strong>.</p>
             <p>Scan this QR Code at the entrance:</p>
             <img src="${qrImage}" alt="QR Code" style="width:200px;height:200px;"/>`,
    });

    res.status(200).json({ message: "Registered successfully", registration });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

const exportRegisteredUsers = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate("registeredUsers.user");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Registered Users");

    worksheet.columns = [
      { header: "Full Name", key: "fullName", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Username", key: "username", width: 20 },
      { header: "Payment Status", key: "paymentStatus", width: 15 },
      { header: "Registered At", key: "registeredAt", width: 25 },
    ];

    event.registeredUsers.forEach(({ user, paymentStatus, registeredAt }) => {
      worksheet.addRow({
        fullName: user.fullName || "",
        email: user.email || "",
        username: user.username || "",
        paymentStatus,
        registeredAt: new Date(registeredAt).toLocaleString(),
      });
    });

    const filePath = path.join(__dirname, `../exports/event-${eventId}-users.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath);
  } catch (error) {
    console.error("Error exporting users:", error);
    res.status(500).json({ message: "Failed to export registered users", error: error.message });
  }
});





export { createEvents,
  exportRegisteredUsers,
  showEvents,
  updateEvent,
  getSingleEvent,
 };
