import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    // Basic Info
    title: { type: String, required: true },
    description: { type: String },

    // Dates & Duration
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    duration: { type: String }, // Format: "HH:MM"

    // Online / Offline
    medium: { type: String, enum: ["online", "offline"], default: "offline" },
    meet: [String], // Meeting links (for online)
    location: [String], // Venue or coordinates (for offline)

    // Visual
    image: { type: String }, // Cover image URL

    // RSVP & Attendance
    acceptingRsvp: { type: Boolean, default: true },
    acceptingAttendance: { type: Boolean, default: false },

    // Capacity & Access
    maxParticipants: { type: Number },
    privacy: { type: String, enum: ["public", "private"], default: "public" },

    // Organiser Info
    isExternalOrganiser: { type: Boolean, default: false },
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    externalOrganiserInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      organisation: { type: String }, // Optional
    },

    // Club / Department
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },

    // Registration & Payment
    price: { type: Number, default: 0 },
    invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    registeredUsers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        paymentStatus: {
          type: String,
          enum: ["pending", "completed"],
          default: "pending",
        },
        qrCode: { type: String },
        registeredAt: { type: Date, default: Date.now },
      },
    ],

    // Meta
    category: { type: String },
    language: { type: String },
    tnc: { type: String }, // Terms and Conditions
    adminNotes: { type: String },

    // Waitlist & Feedback
    waitlist: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    feedback: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
      },
    ],

    // Status
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },

    // Creator Info
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Organiser Validation
eventSchema.pre("validate", function (next) {
  if (this.isExternalOrganiser) {
    const info = this.externalOrganiserInfo || {};
    if (!info.name || !info.email || !info.phone) {
      return next(
        new Error("External organiser must have name, email, and phone.")
      );
    }
  } else {
    if (!this.organiser) {
      return next(new Error("Internal organiser (User) is required."));
    }
  }
  next();
});

export const Event = mongoose.model("Event", eventSchema);
