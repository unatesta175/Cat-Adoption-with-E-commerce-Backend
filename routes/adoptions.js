import express from 'express';
import Stripe from 'stripe';
import Adoption from '../models/Adoption.js';
import Cat from '../models/Cat.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Initialize Stripe lazily to ensure environment variables are loaded
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// @route   POST /api/adoptions/create-payment-intent
// @desc    Create payment intent for cat adoption
// @access  Private
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ message: 'Payment processing is not configured. Please set STRIPE_SECRET_KEY in environment variables.' });
    }

    const { catId } = req.body;

    // Check if cat exists and is not adopted
    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({ message: 'Cat not found' });
    }

    if (cat.isAdopted) {
      return res.status(400).json({ message: 'Cat is already adopted' });
    }

    // Check if user already has pending/paid adoption for this cat
    const existingAdoption = await Adoption.findOne({
      userId: req.user._id,
      catId,
      status: { $in: ['pending', 'paid', 'processing', 'completed'] }
    });

    if (existingAdoption) {
      return res.status(400).json({ message: 'You already have an adoption request for this cat' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(cat.adoptionFee * 100), // Convert to cents
      currency: 'myr', // Malaysian Ringgit
      metadata: {
        userId: req.user._id.toString(),
        catId: catId.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: cat.adoptionFee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/adoptions/purchase
// @desc    Create adoption after successful payment
// @access  Private
router.post('/purchase', protect, async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ message: 'Payment processing is not configured. Please set STRIPE_SECRET_KEY in environment variables.' });
    }

    const { catId, paymentIntentId, shippingAddress } = req.body;

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Check if cat exists and is not adopted
    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({ message: 'Cat not found' });
    }

    if (cat.isAdopted) {
      return res.status(400).json({ message: 'Cat is already adopted' });
    }

    // Check if user already has adoption for this cat
    const existingAdoption = await Adoption.findOne({
      userId: req.user._id,
      catId,
      status: { $in: ['pending', 'paid', 'processing', 'completed'] }
    });

    if (existingAdoption) {
      return res.status(400).json({ message: 'You already have an adoption for this cat' });
    }

    // Create adoption
    const adoption = await Adoption.create({
      userId: req.user._id,
      catId,
      adoptionFee: cat.adoptionFee,
      paymentIntentId,
      shippingAddress,
      status: 'paid'
    });

    // Mark cat as adopted
    cat.isAdopted = true;
    await cat.save();

    const populatedAdoption = await Adoption.findById(adoption._id)
      .populate('userId', 'name email')
      .populate('catId');

    res.status(201).json(populatedAdoption);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   GET /api/adoptions/my-requests
// @desc    Get current user's adoption requests
// @access  Private
router.get('/my-requests', protect, async (req, res) => {
  try {
    const adoptions = await Adoption.find({ userId: req.user._id })
      .populate('catId')
      .sort({ createdAt: -1 });

    res.json(adoptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/adoptions
// @desc    Get all adoption requests (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const adoptions = await Adoption.find()
      .populate('userId', 'name email')
      .populate('catId')
      .sort({ createdAt: -1 });

    res.json(adoptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/adoptions/:id/status
// @desc    Update adoption status (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'paid', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const adoption = await Adoption.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('catId');

    if (!adoption) {
      return res.status(404).json({ message: 'Adoption not found' });
    }

    adoption.status = status;
    await adoption.save();

    // If cancelled, mark cat as available again
    if (status === 'cancelled') {
      const cat = await Cat.findById(adoption.catId._id);
      if (cat) {
        cat.isAdopted = false;
        await cat.save();
      }
    }

    res.json(adoption);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;




