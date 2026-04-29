const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createAppointment, getMyAppointments, updateAppointmentStatus, updateAppointmentAgenda } = require('../controllers/appointmentController');

router.route('/')
    .post(protect, createAppointment);

router.route('/me')
    .get(protect, getMyAppointments);

router.route('/:id/status')
    .patch(protect, updateAppointmentStatus);

router.route('/:id/agenda')
    .patch(protect, updateAppointmentAgenda);

module.exports = router;
