import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    coverImage: { type: String },
    isPV: { type: Boolean, default: false },

    organisateurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],

    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export const Evenement = mongoose.model('Evenement', eventSchema);
