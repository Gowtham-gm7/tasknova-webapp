const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: true },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationToken: String,
  productivityScore: { type: Number, default: 75 },
  streak: { type: Number, default: 1 },
  longestStreak: { type: Number, default: 1 },
  dailyGoal: { type: Number, default: 5 },
  badges: [{
    id: String,
    name: String,
    icon: String,
    unlockedAt: { type: Date, default: Date.now }
  }],
  themePreference: { type: String, enum: ['dark', 'light'], default: 'dark' },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
