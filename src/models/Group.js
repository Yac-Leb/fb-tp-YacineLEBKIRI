import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    icon: { type: String },
    coverImage: { type: String },

    // public | privé | secret
    type: {
      type: String,
      enum: ['public', 'private', 'secret'],
      default: 'public'
    },

    // administrateurs du groupe
    admins: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    ],

    // membres du groupe
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // options
    allowMemberPosts: { type: Boolean, default: true },
    allowEventCreation: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Group = mongoose.model('Group', groupSchema);
