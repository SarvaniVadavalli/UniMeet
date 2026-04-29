const TimeSlot = require('../models/TimeSlot');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a new time slot
// @route   POST /api/slots
// @access  Private (Faculty only)
const createSlot = async (req, res) => {
    if (req.user.role !== 'FACULTY_ROLE') {
        return res.status(403).json({ message: 'Not authorized as Faculty' });
    }

    const { startTime, endTime, type } = req.body;
    console.log('Slot Creation Request:', { startTime, endTime, type, user: req.user._id });

    try {
        const slot = await TimeSlot.create({
            facultyId: req.user._id,
            startTime,
            endTime,
            type: type || 'Standard_SYNC'
        });

        console.log('Slot Created Successfully:', slot._id);

        // Broadcast to relevant students (Currently all students, can be filtered by dept later)
        try {
            const students = await User.find({ role: 'STUDENT_ROLE' }).select('_id');
            if (students.length > 0) {
                const notifications = students.map(student => ({
                    user: student._id,
                    message: `Dr. ${req.user.name || 'Faculty'} has opened a new Temporal Slot!`,
                    type: 'INFO'
                }));
                await Notification.insertMany(notifications);
                console.log(`Notifications sent to ${students.length} students`);
            }
        } catch (notifError) {
            console.error('Error broadcasting notifications:', notifError);
            // We don't fail the slot creation just because notifications failed
        }

        res.status(201).json(slot);
    } catch (error) {
        console.error('Error creating slot:', error);
        res.status(500).json({ message: 'Server error creating time slot', error: error.message });
    }
};

// @desc    Get current faculty time slots
// @route   GET /api/slots/me
// @access  Private (Faculty only)
const getMySlots = async (req, res) => {
    if (req.user.role !== 'FACULTY_ROLE') {
        return res.status(403).json({ message: 'Not authorized as Faculty' });
    }

    try {
        const slots = await TimeSlot.find({ facultyId: req.user._id }).sort({ startTime: 1 });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching slots' });
    }
};

// @desc    Delete a slot (only if available)
// @route   DELETE /api/slots/:id
// @access  Private (Faculty only)
const deleteSlot = async (req, res) => {
    if (req.user.role !== 'FACULTY_ROLE') {
        return res.status(403).json({ message: 'Not authorized as Faculty' });
    }

    try {
        const slot = await TimeSlot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }
        
        // Ensure same faculty
        if (slot.facultyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this slot' });
        }

        // Prevent deleting booked slots without handling
        if (slot.status === 'BOOKED') {
            return res.status(400).json({ message: 'Cannot delete a booked slot. Cancel the appointment first.' });
        }

        await TimeSlot.findByIdAndDelete(req.params.id);
        res.json({ message: 'Slot deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting slot' });
    }
};

module.exports = {
    createSlot,
    getMySlots,
    deleteSlot
};
