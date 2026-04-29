const User = require('../models/User');
const Appointment = require('../models/Appointment');
const FacultyProfile = require('../models/Faculty');

const TimeSlot = require('../models/TimeSlot');

// @desc    Get global admin telemetry stats
// @route   GET /api/admin/stats
// @access  Private (Admin Role)
const getAdminStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'STUDENT_ROLE' });
        const totalFaculty = await User.countDocuments({ role: 'FACULTY_ROLE' });
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'PENDING' });
        const approvedAppointments = await Appointment.countDocuments({ status: 'APPROVED' });
        const rejectedAppointments = await Appointment.countDocuments({ status: 'REJECTED' });

        res.json({
            students: totalStudents,
            faculty: totalFaculty,
            appointments: totalAppointments,
            pending: pendingAppointments,
            approved: approvedAppointments,
            rejected: rejectedAppointments
        });
    } catch (error) {
        res.status(500).json({ message: 'Server failure during telemetry collection' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin Role)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server failure during user collection' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin Role)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'ADMIN_ROLE') {
            return res.status(400).json({ message: 'Cannot delete ADMIN_ROLE users.' });
        }

        // Cascade delete: Remove related appointments, timeslots, and profiles
        if (user.role === 'FACULTY_ROLE') {
            await FacultyProfile.findOneAndDelete({ user: user._id });
            const slots = await TimeSlot.find({ facultyId: user._id });
            const slotIds = slots.map(slot => slot._id);
            await Appointment.deleteMany({ slotId: { $in: slotIds } });
            await TimeSlot.deleteMany({ facultyId: user._id });
        } else if (user.role === 'STUDENT_ROLE') {
            await Appointment.deleteMany({ studentId: user._id });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User and all related data removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server failure during user deletion' });
    }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private (Admin Role)
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('studentId', 'name email')
            .populate('facultyId', 'name email')
            .populate('slotId', 'startTime endTime')
            .sort({ createdAt: -1 });
            
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server failure during appointment collection' });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    deleteUser,
    getAllAppointments
};
