import mongoose from 'mongoose';

const catSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'default-cat.jpg'
  },
  traits: {
    energyLevel: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      required: true
    },
    maintenanceLevel: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      required: true
    },
    goodWithKids: {
      type: Boolean,
      default: false
    },
    personality: {
      type: String,
      enum: ['playful', 'calm', 'independent', 'social'],
      required: true
    }
  },
  isAdopted: {
    type: Boolean,
    default: false
  },
  adoptionFee: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

const Cat = mongoose.model('Cat', catSchema);

export default Cat;




