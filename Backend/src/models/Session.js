import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, default: '' },
    fileData: {
      fileName: { type: String },
      fileType: { type: String },
      fileUrl: { type: String },
      fileSize: { type: String },
    },
  },
  { timestamps: true }
);

const sessionSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    scheduledAt: { type: Date },
    meetingStatus: {
      type: String,
      enum: ['none', 'requested', 'scheduled', 'declined', 'completed'],
      default: 'none',
    },
    meetingRequestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requesterCompleted: { type: Boolean, default: false },
    helperCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    messages: [messageSchema],
    notes: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5 },

    review: { type: String, default: '' },
    requesterRating: { type: Number, min: 1, max: 5 },
    requesterReview: { type: String, default: '' },
    helperRating: { type: Number, min: 1, max: 5 },
    helperReview: { type: String, default: '' },
  },
  { timestamps: true }
);


const Session = mongoose.model('Session', sessionSchema);
export default Session;
