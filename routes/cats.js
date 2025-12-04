import express from 'express';
import { body, validationResult } from 'express-validator';
import Cat from '../models/Cat.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/cats
// @desc    Get all cats (not adopted)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const cats = await Cat.find({ isAdopted: false }).sort({ createdAt: -1 });
    res.json(cats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cats/:id
// @desc    Get single cat by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);

    if (cat) {
      res.json(cat);
    } else {
      res.status(404).json({ message: 'Cat not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cats
// @desc    Create a new cat
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  upload.single('image'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('breed').trim().notEmpty().withMessage('Breed is required'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive number'),
    body('gender').isIn(['male', 'female']).withMessage('Gender must be male or female'),
    body('description').trim().notEmpty().withMessage('Description is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, breed, age, gender, description, traits, adoptionFee } = req.body;

      // Parse traits if it's a string
      const parsedTraits = typeof traits === 'string' ? JSON.parse(traits) : traits;

      const cat = await Cat.create({
        name,
        breed,
        age,
        gender,
        description,
        adoptionFee: adoptionFee || 0,
        image: req.file ? req.file.filename : 'default-cat.jpg',
        traits: parsedTraits
      });

      res.status(201).json(cat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/cats/:id
// @desc    Update a cat
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  admin,
  upload.single('image'),
  async (req, res) => {
    try {
      const cat = await Cat.findById(req.params.id);

      if (cat) {
        const { name, breed, age, gender, description, traits, adoptionFee } = req.body;

        cat.name = name || cat.name;
        cat.breed = breed || cat.breed;
        cat.age = age || cat.age;
        cat.gender = gender || cat.gender;
        cat.description = description || cat.description;
        if (adoptionFee !== undefined) cat.adoptionFee = adoptionFee;

        if (traits) {
          const parsedTraits = typeof traits === 'string' ? JSON.parse(traits) : traits;
          cat.traits = { ...cat.traits, ...parsedTraits };
        }

        if (req.file) {
          cat.image = req.file.filename;
        }

        const updatedCat = await cat.save();
        res.json(updatedCat);
      } else {
        res.status(404).json({ message: 'Cat not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/cats/:id
// @desc    Delete a cat
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);

    if (cat) {
      await cat.deleteOne();
      res.json({ message: 'Cat removed' });
    } else {
      res.status(404).json({ message: 'Cat not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;




