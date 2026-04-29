const User = require('../models/User');
const FacultyProfile = require('../models/Faculty');
const TimeSlot = require('../models/TimeSlot');

// @desc    Get all faculty members with profiles
// @route   GET /api/faculty
// @access  Private
const getFaculties = async (req, res) => {
    try {
        const faculties = await User.find({ role: 'FACULTY_ROLE' }).select('-password');
        const facultyIds = faculties.map(f => f._id);
        
        // Fetch their profiles
        const profiles = await FacultyProfile.find({ user: { $in: facultyIds } });

        // Merge user details and profile
        const facultyData = faculties.map(faculty => {
            const profile = profiles.find(p => p.user.toString() === faculty._id.toString());
            return {
                _id: faculty._id,
                name: faculty.name,
                email: faculty.email,
                profile: profile || null
            };
        });

        res.json(facultyData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error locating faculty' });
    }
};

// @desc    Get faculty profile and available slots
// @route   GET /api/faculty/:id
// @access  Private
const getFacultyById = async (req, res) => {
    try {
        const faculty = await User.findById(req.params.id).select('-password');
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const profile = await FacultyProfile.findOne({ user: faculty._id });
        const slots = await TimeSlot.find({ facultyId: faculty._id }).sort({ startTime: 1 });

        res.json({
            _id: faculty._id,
            name: faculty.name,
            email: faculty.email,
            profile: profile || null,
            slots
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error locating faculty details' });
    }
};

// @desc    Update faculty profile
// @route   PUT /api/faculty/profile
// @access  Private (Faculty Only)
const updateFacultyProfile = async (req, res) => {
    if (req.user.role !== 'FACULTY_ROLE') {
        return res.status(403).json({ message: 'Only faculty can update their profile' });
    }

    const { bio, expertise, department, title } = req.body;

    try {
        let profile = await FacultyProfile.findOne({ user: req.user._id });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        profile.bio = bio || profile.bio;
        profile.department = department || profile.department;
        profile.title = title || profile.title;
        
        if (expertise && Array.isArray(expertise)) {
            profile.expertise = expertise;
        }

        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

module.exports = {
    getFaculties,
    getFacultyById,
    updateFacultyProfile
};
