import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String, // e.g., "short note", "PYQ", "lecture", etc.
      enum: ["short note", "PYQ", "lecture", "question bank", "quantum", "notes"], // Add any types you want to support
      required: true,
    },
    fileUrl: {
      type: String, // URL of the file (e.g., cloud storage URL like Cloudinary)
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (author of the note)
      required: true,
    },
    tags: {
      type: [String], // Tags associated with the note (e.g., "Math", "Physics", etc.)
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: true, // Whether the note is publicly accessible or only to the user
    },
    is_deleted: {
      type: Boolean,
      default: false, // Whether the note
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Optional: Instance methods for additional logic if needed, like fetching notes by specific tags

export const Note = mongoose.model("Note", noteSchema);
