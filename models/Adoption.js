import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  catId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cat',
    required: true
  },
  adoptionFee: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String,
    required: false
  },
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
}, {
  timestamps: true
});

const Adoption = mongoose.model('Adoption', adoptionSchema);

export default Adoption;




