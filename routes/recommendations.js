import express from 'express';
import Cat from '../models/Cat.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { getRecommendations } from '../services/recommendationService.js';

const router = express.Router();

// @route   GET /api/recommendations
// @desc    Get recommended cats based on user preferences
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has set preferences
    if (!user.preferences || !user.preferences.homeType) {
      return res.status(400).json({ 
        message: 'Please complete your lifestyle survey first',
        hasPreferences: false
      });
    }

    // Get all available cats
    const cats = await Cat.find({ isAdopted: false });

    if (cats.length === 0) {
      return res.json([]);
    }

    // Get recommendations
    const recommendations = await getRecommendations(user.preferences, cats);

    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;




