const Bug = require('../models/Bug');
const { validationResult } = require('express-validator');

// Get all bugs with optional filtering
exports.getBugs = async (req, res, next) => {
  try {
    console.log('Fetching bugs with query:', req.query); // Debugging log

    const { status, priority, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const bugs = await Bug.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Bug.countDocuments(filter);

    res.json({
      bugs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching bugs:', error); // Debugging log
    next(error);
  }
};

// Get single bug by ID
exports.getBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    res.json(bug);
  } catch (error) {
    console.error('Error fetching bug:', error);
    next(error);
  }
};

// Create new bug
exports.createBug = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bug = new Bug(req.body);
    const savedBug = await bug.save();

    console.log('Bug created:', savedBug._id); // Debugging log
    res.status(201).json(savedBug);
  } catch (error) {
    console.error('Error creating bug:', error);
    next(error);
  }
};

// Update bug
exports.updateBug = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    console.log('Bug updated:', bug._id); // Debugging log
    res.json(bug);
  } catch (error) {
    console.error('Error updating bug:', error);
    next(error);
  }
};

// Delete bug
exports.deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    console.log('Bug deleted:', bug._id); // Debugging log
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    console.error('Error deleting bug:', error);
    next(error);
  }
};
