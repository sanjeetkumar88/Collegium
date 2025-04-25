import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  tags: {
    type: [String],
    required: true,
  },

  problemStatement: {
    type: String,
  },

  technologiesUsed: {
    type: [String],
    required: true,
  },

  status: {
    type: String,
    enum: ['ongoing', 'completed', 'on-hold'],
    required: true,
  },

  projectUrl: {
    type: String,
    required: true,
  },

  githubRepo: {
    type: String,
    required: true,
  },

  openForCollaboration: {
    type: Boolean,
    default: false,
  },

  contactInfo: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
  },

  demoVideo: {
    type: String,
  },

  coverImage: {
    type: String,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],

  collaboratorsInvited: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      invitedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
      }
    }
  ],

  joinRequests: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      message: String,
      requestedAt: {
        type: Date,
        default: Date.now,
      }
    }
  ],

}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);
