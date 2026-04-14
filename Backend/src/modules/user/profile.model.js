import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }, // Reference to the User model
  bio: { type: String },
  personalWebsite: { type: String },
  education: [{
    institution: { type: String },
    degree: { type: String },
    startYear: { type: Number },
    endYear: { type: Number },
    description: { type: String }
  }], // Education history
  projects: [{
    title: { type: String },
    description: { type: String },
    link: { type: String },  // GitHub, personal project URL, etc.
    year: { type: Number }
  }], // List of student projects
  achievements: [{
    title: { type: String },
    description: { type: String },
    date: { type: Date }
  }], // Achievements or awards
  contact: {
    phone: { type: String },
    email: { type: String }
  },  // Contact details
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    portfolio: { type: String }
  },  // Social media or portfolio links
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const Profile = mongoose.model('Profile', profileSchema);
