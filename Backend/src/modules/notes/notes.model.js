import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String, // e.g., "Handwritten", "Digital", "PPT"
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    branch: {
      type: String,
      enum: [
        "Common",
        "Computer Science",
        "Mechanical",
        "Electrical",
        "Civil",
        "Electronics",
        "Biotechnology",
        "IT",
        "Chemical",
        "Other",
      ],
      default: "Other",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for optimized searching
noteSchema.index({ title: "text", tags: "text", branch: "text" });

// Pre-save hook to format titles properly
noteSchema.pre("save", function (next) {
  this.title = this.title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  next();
});

export const Note = mongoose.model("Note", noteSchema);
