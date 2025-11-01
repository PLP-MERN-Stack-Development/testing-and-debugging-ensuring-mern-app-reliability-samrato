const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bugsController = require('../controllers/bugs');

// Validation middleware
const bugValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved'])
    .withMessage('Status must be one of: open, in-progress, resolved'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),
  body('reporter')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Reporter name is required')
];

// Routes
router.get('/', bugsController.getBugs);
router.get('/:id', bugsController.getBug);
router.post('/', bugValidation, bugsController.createBug);
router.put('/:id', bugValidation, bugsController.updateBug);
router.delete('/:id', bugsController.deleteBug);

module.exports = router;
