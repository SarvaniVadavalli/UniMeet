const mongoose = require('mongoose');
const User = require('./models/User');

async function updateAdmin() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/unimeet');
        const res = await User.updateOne(
            { email: 'admin@unimeet.com' }, 
            { $set: { email: 'admin@gmail.com' } }
        );
        console.log(res.modifiedCount > 0 ? 'Admin email updated in DB' : 'Admin email not found or already updated');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateAdmin();
