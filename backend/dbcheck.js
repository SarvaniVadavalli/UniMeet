const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const User = require('./models/User');

async function checkAppointments() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/unimeet');
        console.log('Connected to DB');

        const appointments = await Appointment.find().populate('studentId').populate('facultyId');
        console.log('Found', appointments.length, 'appointments');

        appointments.forEach(app => {
            console.log('--- Appointment ---');
            console.log('ID:', app._id);
            console.log('Status:', app.status);
            console.log('Student:', app.studentId ? `${app.studentId.name} (${app.studentId._id})` : 'NULL');
            console.log('Faculty:', app.facultyId ? `${app.facultyId.name} (${app.facultyId._id})` : 'NULL');
            console.log('Slot ID:', app.slotId);
            console.log('Agenda:', app.agenda);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAppointments();
