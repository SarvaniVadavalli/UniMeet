const mongoose = require('mongoose');

const facultyProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        expertise: {
            type: [String],
            default: ['General Syllabus'],
        },
        department: {
            type: String,
            default: 'General Academics',
        },
        title: {
            type: String,
            default: 'Lecturer',
        },
        bio: {
            type: String,
            default: 'Faculty member at Unimeet Nexus.',
        },
        rating: {
            type: Number,
            default: 0,
        },
        totalSessions: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

const FacultyProfile = mongoose.model('FacultyProfile', facultyProfileSchema);
module.exports = FacultyProfile;
