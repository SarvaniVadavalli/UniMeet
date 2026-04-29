const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        facultyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        slotId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TimeSlot',
            required: true,
            unique: true, // Crucial: One appointment per time slot max. Acts as secondary safety.
        },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'],
            default: 'PENDING',
            required: true,
        },
        agenda: {
            type: String,
        },
        responseNote: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
