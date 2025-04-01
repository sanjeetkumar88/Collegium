import mongoose, { Schema } from "mongoose";

const clubSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensures no two clubs have the same name
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500, // Limit description length for better database efficiency
    },
    logo: {
      type: String, // URL for logo image
      default: "", // Prevents undefined value
    },
    coverimage: { 
      type: String, // URL for cover image
      default: "", // Prevents undefined value
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId, // Single club leader
      ref: "User",
      required: true, // Ensures a leader must be assigned
    },
    coLeaders: [
      {
        type: mongoose.Schema.Types.ObjectId, // Array for co-leaders
        ref: "User",
        default: [],
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId, // Club members
        ref: "User",
      },
    ],
    tags: {
      type: [String], // Array of tags to classify the club (e.g., "sports", "tech")
      default: [],
    },
    mentor:[
        {
            type:mongoose.Schema.Types.ObjectId,// Club mentors
            ref:"User",
        },
    ],
    visibility: {
      type: String,
      enum: ["public", "private"], // Helps control access (public vs private)
      default: "public", // Default visibility is public
    },
    appliedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId, // Users who applied to join
        ref: "User",
        default: [],
      },
    ],
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatic timestamps (createdAt, updatedAt)
  }
);

export const Club = mongoose.model("Club", clubSchema);
