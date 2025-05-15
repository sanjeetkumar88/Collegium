import { Club } from "../models/club.model.js";
import mongoose from "mongoose";

export const canCreateEvent = async (req, res, next) => {
  const user = req.user;

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  if (user.role === 'admin' || user.role === 'teacher') {
    return next();
  }

  if (user.role === 'student') {
    // Check if the student is a leader of any club
    const club = await Club.findOne({ leader: user._id });
    if (club) {
      return next();
    }
  }

  return res.status(403).json({ message: 'Access denied: Not authorized to create an event' });
};


