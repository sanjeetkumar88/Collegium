const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },

    venue: { type: String },
    isOnline: { type: Boolean, default: false },
    meetingLink: { type: String },

    // Images
    logo: { type: String },      // URL to logo image
    coverImg: { type: String },  // URL to cover image

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

    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },

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

    isFree: { type: Boolean, default: true },
    price: { type: Number, default: 0 },

    category: { type: String },
    tags: [String],

    capacity: { type: Number },
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

    isRecurring: { type: Boolean, default: false },
    recurrencePattern: { type: String },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },

    adminNotes: { type: String },
  },
  { timestamps: true }
);

// Validation to ensure organiser info is correct
eventSchema.pre("validate", function (next) {
  if (this.isExternalOrganiser) {
    if (
      !this.externalOrganiserInfo?.name ||
      !this.externalOrganiserInfo?.email ||
      !this.externalOrganiserInfo?.phone
    ) {
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

module.exports = mongoose.model("Event", eventSchema);
