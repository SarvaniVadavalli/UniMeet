const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUser() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/unimeet');
        console.log('Connected to DB');

        const user = await User.findById('69e85330a5e81afd704a38f0');
        if (user) {
            console.log('User found:', user);
        } else {
            console.log('User NOT found');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUser();
