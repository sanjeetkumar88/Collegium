const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user
  bio: { type: String, trim: true },  // Short biography or introduction
  skills: [{ type: String }],  // List of skills (e.g., programming languages, tools)
  education: [{
    degree: { type: String }, // e.g., BSc, MSc, etc.
    institution: { type: String },
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

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
