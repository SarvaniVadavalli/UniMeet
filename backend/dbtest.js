const mongoose = require('mongoose');
const User = require('./models/User');
const Notification = require('./models/Notification');
require('dotenv').config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const faculty = await User.findOne({ role: 'FACULTY_ROLE' });
        if (!faculty) {
             console.log("No faculty found.");
             process.exit(1);
        }
        console.log("Found faculty:", faculty.name);
        const students = await User.find({ role: 'STUDENT_ROLE' }).select('_id');
        if (students.length > 0) {
            const notifications = students.map(student => ({
                user: student._id,
                message: `Dr. ${faculty.name} has opened a new Temporal Slot!`,
                type: 'INFO'
            }));
            await Notification.insertMany(notifications);
            console.log("Inserted notifications:", notifications.length);
        } else {
            console.log("No students found.");
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
test();
