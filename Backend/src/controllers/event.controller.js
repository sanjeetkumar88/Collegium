import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {Event} from "../models/event.model.js"
import {Club} from "../models/club.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const createEvent = async (req, res) => {
    try {
      const {
        title,
        description,
        date,
        startTime,
        endTime,
        venue,
        isOnline,
        meetingLink,
        logo,
        coverImg,
        isExternalOrganiser,
        organiser, // user ID (if internal)
        externalOrganiserInfo, // { name, email, phone, organisation? }
        club, // club ID
        invitedUsers,
        isFree,
        price,
        category,
        tags,
        capacity,
        isRecurring,
        recurrencePattern,
        adminNotes,
      } = req.body;
  
      // Input validation
      if (!title || !date) {
        return res.status(400).json({ message: "Title and date are required." });
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
          return res.status(400).json({ message: "Internal organiser is required." });
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
  
      const newEvent = new Event({
        title,
        description,
        date,
        startTime,
        endTime,
        venue,
        isOnline,
        meetingLink,
        logo,
        coverImg,
        isExternalOrganiser,
        organiser: isExternalOrganiser ? undefined : organiser,
        externalOrganiserInfo: isExternalOrganiser ? externalOrganiserInfo : undefined,
        club,
        invitedUsers,
        isFree,
        price,
        category,
        tags,
        capacity,
        isRecurring,
        recurrencePattern,
        adminNotes,
      });
  
      await newEvent.save();
      res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (err) {
      console.error("Error creating event:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
  module.exports = {
    createEvent,
  };






