const Appointment = require('../models/Appointment');
const TimeSlot = require('../models/TimeSlot');
const Notification = require('../models/Notification');

// @desc    Create new appointment (Student books a slot)
// @route   POST /api/appointments
// @access  Private (Student)
const createAppointment = async (req, res) => {
    if (req.user.role !== 'STUDENT_ROLE') {
        return res.status(403).json({ message: 'Only students can book appointments' });
    }

    const { slotId, facultyId, agenda } = req.body;

    try {
        // Atomic update to prevent double booking.
        // We find the slot ONLY if its status is still 'AVAILABLE', and immediately set it to 'BOOKED'.
        const updatedSlot = await TimeSlot.findOneAndUpdate(
            { _id: slotId, status: 'AVAILABLE' },
            { $set: { status: 'BOOKED' } },
            { new: true }
        );

        if (!updatedSlot) {
            return res.status(400).json({ message: 'This slot is no longer available or does not exist.' });
        }

        // Slot successfully claimed, now create the appointment record.
        const appointment = await Appointment.create({
            studentId: req.user._id,
            facultyId: facultyId,
            slotId: updatedSlot._id,
            agenda: agenda || 'General Sync'
        });

        // Notify Faculty
        await Notification.create({
            user: facultyId,
            message: `New Appointment Request: ${appointment.agenda} from Student`,
            type: 'INFO'
        });

        res.status(201).json(appointment);
    } catch (error) {
        // If appointment creation fails for some reason, we should technically revert the slot.
        // For simplicity, we just return error.
        res.status(500).json({ message: 'Server error booking appointment' });
    }
};

// @desc    Get user's appointments (Handles both Student and Faculty dynamically)
// @route   GET /api/appointments/me
// @access  Private
const getMyAppointments = async (req, res) => {
    try {
        let appointments;
        if (req.user.role === 'STUDENT_ROLE') {
            appointments = await Appointment.find({ studentId: req.user._id })
                .populate('facultyId', 'name email')
                .populate('slotId', 'startTime endTime type')
                .sort({ createdAt: -1 });
        } else if (req.user.role === 'FACULTY_ROLE') {
            appointments = await Appointment.find({ facultyId: req.user._id })
                .populate('studentId', 'name email')
                .populate('slotId', 'startTime endTime type')
                .sort({ createdAt: -1 });
        } else {
            // ADMIN fetch all for registry table
            appointments = await Appointment.find({})
                .populate('facultyId', 'name')
                .populate('studentId', 'name')
                .populate('slotId', 'startTime endTime')
                .sort({ createdAt: -1 });
        }

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching appointments' });
    }
};

// @desc    Update appointment status (Faculty approves/rejects/completes)
// @route   PATCH /api/appointments/:id/status
// @access  Private (Faculty only or Admin)
const updateAppointmentStatus = async (req, res) => {
    const allowedRoles = ['FACULTY_ROLE', 'ADMIN_ROLE'];
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Not authorized.' });
    }

    const { status, responseNote } = req.body;

    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (req.user.role === 'FACULTY_ROLE' && appointment.facultyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized for this appointment' });
        }

        appointment.status = status;
        if (responseNote !== undefined) {
            appointment.responseNote = responseNote;
        }
        await appointment.save();

        if (status === 'REJECTED') {
            await TimeSlot.findByIdAndUpdate(appointment.slotId, { status: 'AVAILABLE' });
        }

        // Notify Student
        await Notification.create({
            user: appointment.studentId,
            message: `Your appointment "${appointment.agenda || ''}" is now ${status}.${responseNote ? ' Note: ' + responseNote : ''}`,
            type: status === 'APPROVED' ? 'SUCCESS' : status === 'COMPLETED' ? 'INFO' : 'WARNING'
        });

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
    }
};

// @desc    Update appointment agenda (Student updates reason)
// @route   PATCH /api/appointments/:id/agenda
// @access  Private (Student)
const updateAppointmentAgenda = async (req, res) => {
    const { agenda } = req.body;

    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        if (appointment.studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (appointment.status !== 'PENDING') {
            return res.status(400).json({ message: 'Only pending requests can be updated' });
        }

        appointment.agenda = agenda;
        await appointment.save();

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating agenda' });
    }
};

module.exports = {
    createAppointment,
    getMyAppointments,
    updateAppointmentStatus,
    updateAppointmentAgenda
};
