const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const User = require('./models/User');

async function testAuth() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/unimeet');
        console.log('Connected');

        const suhail = await User.findOne({ name: 'Suhail' });
        console.log('Suhail Role:', suhail.role);

        const roleCheck = (suhail.role !== 'FACULTY_ROLE' && suhail.role !== 'ADMIN_ROLE');
        console.log('Will trigger error:', roleCheck);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testAuth();
