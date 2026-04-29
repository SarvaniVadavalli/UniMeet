const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createSlot, getMySlots, deleteSlot } = require('../controllers/slotController');

router.route('/')
    .post(protect, createSlot);

router.route('/me')
    .get(protect, getMySlots);

router.route('/:id')
    .delete(protect, deleteSlot);

module.exports = router;
