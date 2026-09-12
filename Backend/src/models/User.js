import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, default: '', maxlength: 500 },
    avatar: { type: String, default: '' },
    skillsOffered: [{ type: String, trim: true }],
    skillsWanted: [{ type: String, trim: true }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const pts = this.points || 0;
  let badge = '🌱 Newbie Swapper';
  if (pts >= 1000) badge = '💎 Diamond Master';
  else if (pts >= 500) badge = '🥇 Gold Swapper';
  else if (pts >= 250) badge = '🥈 Silver Swapper';
  else if (pts > 0) badge = '🥉 Bronze Swapper';

  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    bio: this.bio,
    avatar: this.avatar,
    skillsOffered: this.skillsOffered,
    skillsWanted: this.skillsWanted,
    rating: this.rating,
    ratingCount: this.ratingCount,
    sessionsCompleted: this.sessionsCompleted,
    connections: this.connections,
    points: pts,
    badge,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);
export default User;
