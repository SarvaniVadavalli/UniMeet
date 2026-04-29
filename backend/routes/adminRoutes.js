const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const { getAdminStats, getAllUsers, deleteUser, getAllAppointments } = require('../controllers/adminController');

router.route('/stats').get(protect, adminOnly, getAdminStats);
router.route('/users').get(protect, adminOnly, getAllUsers);
router.route('/users/:id').delete(protect, adminOnly, deleteUser);
router.route('/appointments').get(protect, adminOnly, getAllAppointments);
module.exports = router;
