const mongoose = require('mongoose');
const User = require('./models/User');

async function findFaculty() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/unimeet');
        const faculty = await User.findOne({ role: 'FACULTY_ROLE' });
        if (faculty) {
            console.log('Found Faculty:', faculty.email);
        } else {
            console.log('No Faculty found');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

findFaculty();
