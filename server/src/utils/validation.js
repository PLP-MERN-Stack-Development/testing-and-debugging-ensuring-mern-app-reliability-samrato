// Validation utility functions
const validateBugData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (data.title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required');
  } else if (data.description.length > 1000) {
    errors.push('Description cannot exceed 1000 characters');
  }

  if (data.status && !['open', 'in-progress', 'resolved'].includes(data.status)) {
    errors.push('Status must be one of: open, in-progress, resolved');
  }

  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Priority must be one of: low, medium, high');
  }

  if (!data.reporter || data.reporter.trim().length === 0) {
    errors.push('Reporter name is required');
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }

  return true;
};

module.exports = {
  validateBugData
};
