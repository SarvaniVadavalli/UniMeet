const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
    {
        facultyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['AVAILABLE', 'BOOKED'],
            default: 'AVAILABLE',
            required: true,
        },
        type: {
            type: String,
            default: 'Standard_SYNC',
        }
    },
    {
        timestamps: true,
    }
);

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);
module.exports = TimeSlot;
