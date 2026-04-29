const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

async function checkDuplicates() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/unimeet');
        console.log('Connected to DB');

        const appointments = await Appointment.find();
        const slotIds = appointments.map(a => a.slotId.toString());
        const duplicates = slotIds.filter((item, index) => slotIds.indexOf(item) !== index);

        if (duplicates.length > 0) {
            console.log('Found duplicate slot IDs in appointments:', duplicates);
            for (const slotId of duplicates) {
                const apps = await Appointment.find({ slotId: slotId });
                console.log(`Slot ${slotId} has ${apps.length} appointments:`);
                apps.forEach(a => console.log(`  App ID: ${a._id}, Status: ${a.status}`));
            }
        } else {
            console.log('No duplicate slots found in appointments.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDuplicates();
