import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    // Basic Info
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // Dates & Duration
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    duration: { type: String }, // Format: "HH:MM"

    // Online / Offline
    medium: { type: String, enum: ["online", "offline"], default: "offline" },
    meet: [String],
    location: [String],

    // Visual
    image: { type: String },

    // RSVP & Attendance
    acceptingRsvp: { type: Boolean, default: true },
    acceptingAttendance: { type: Boolean, default: false },

    // Capacity & Access
    maxParticipants: { type: Number},
    privacy: { type: String, enum: ["public", "private"], default: "public" },

    // Organiser Info
    organiser: {
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      },
      phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
      },
    },

    // Club / Department
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },

    // Registration & Payment
    price: { type: Number, default: 0 },
    invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    registeredUsers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        paymentId: { type: String }, // <-- new
        paymentStatus: {
          type: String,
          enum: ["pending", "completed", "refunded"],
          default: "pending",
        },
        qrCode: { type: String },
        registeredAt: { type: Date, default: Date.now },
      },
    ],
    

    // Meta
    category: { type: String, trim: true },
    language: { type: String, trim: true },
    tnc: { type: String, trim: true },
    adminNotes: { type: String, trim: true },

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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Virtual: isPaid
eventSchema.virtual("isPaid").get(function () {
  return this.price > 0;
});

// ✅ Pre-save: validate endDate >= startDate
eventSchema.pre("save", function (next) {
  if (this.endDate && this.endDate < this.startDate) {
    return next(new Error("End date cannot be before start date."));
  }
  updateStatus(this);
  next();
});

// ✅ Pre-update: also auto-set status
eventSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.startDate || update.endDate) {
    updateStatus(update);
    this.setUpdate(update);
  }
  next();
});

// ✅ Auto status updater
function updateStatus(event) {
  const now = new Date();
  if (event.status !== "cancelled") {
    if (event.startDate && event.endDate) {
      if (now < event.startDate) event.status = "upcoming";
      else if (now >= event.startDate && now <= event.endDate)
        event.status = "ongoing";
      else if (now > event.endDate) event.status = "completed";
    }
  }
}

// ✅ Indexes
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ club: 1 });
eventSchema.index({ title: 1, club: 1 }, { unique: true });

// ❗ Optional: TTL for auto-deletion of past events
// Uncomment if you want MongoDB to auto-delete completed events X days after endDate
// eventSchema.index({ endDate: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // 30 days

export const Event = mongoose.model("Event", eventSchema);
