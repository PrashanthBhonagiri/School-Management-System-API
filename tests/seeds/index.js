const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
    const User = mongoose.model('User');
    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = [
        {
            email: 'superadmin@test.com',
            password: hashedPassword,
            role: 'superadmin'
        },
        {
            email: 'schooladmin@test.com',
            password: hashedPassword,
            role: 'school_admin'
        }
    ];

    return await User.insertMany(users);
};

const seedSchools = async (adminId) => {
    const School = mongoose.model('School');
    const schools = [
        {
            name: 'Test School 1',
            address: {
                street: '123 Test St',
                city: 'Test City',
                state: 'TS',
                zipCode: '12345'
            },
            contactInfo: {
                email: 'school1@test.com',
                phone: '+1-234-567-8900'
            },
            adminIds: [adminId]
        }
    ];

    return await School.insertMany(schools);
};

const seedClassrooms = async (schoolId) => {
    const Classroom = mongoose.model('Classroom');
    const classrooms = [
        {
            name: 'Class 1A',
            schoolId,
            capacity: 30,
            grade: '1',
            section: 'A',
            teacher: {
                name: 'John Doe',
                email: 'john.doe@test.com',
                phone: '+1-234-567-8901'
            }
        }
    ];

    return await Classroom.insertMany(classrooms);
};

module.exports = {
    seedUsers,
    seedSchools,
    seedClassrooms
};
