import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  preferences: {
    homeType: {
      type: String,
      enum: ['apartment', 'house', 'farm'],
      default: null
    },
    activityLevel: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: null
    },
    hasKids: {
      type: Boolean,
      default: false
    },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'experienced'],
      default: null
    },
    preferredPersonality: {
      type: String,
      enum: ['playful', 'calm', 'independent', 'social'],
      default: null
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;




