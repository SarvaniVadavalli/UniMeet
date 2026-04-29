const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getFaculties, getFacultyById, updateFacultyProfile } = require('../controllers/facultyController');

router.get('/', protect, getFaculties);
router.put('/profile', protect, updateFacultyProfile);
router.get('/:id', protect, getFacultyById);

module.exports = router;
