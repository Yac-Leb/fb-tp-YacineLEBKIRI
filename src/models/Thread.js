import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    // Lié à un groupe OU un événement (mais pas les deux)
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Evenement', default: null },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Thread = mongoose.model('Thread', threadSchema);
