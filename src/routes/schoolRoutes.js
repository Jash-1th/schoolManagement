
const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');


const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/addSchool', asyncHandler(schoolController.addSchool));
router.get('/listSchools', asyncHandler(schoolController.listSchools));

router.use((err, req, res, next) => {
  console.error('Route error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = router;