const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@gmail.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (!existingAdmin) {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 'admin123',
                role: 'ADMIN_ROLE'
            });
            console.log('Default Admin user created successfully.');
        } else {
            // Admin already exists, do nothing but potentially log for debugging
            console.log('Default Admin user already exists. Skipping creation.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
