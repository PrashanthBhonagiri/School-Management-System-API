const mongoose = require('mongoose');
const SchoolService = require('../../../src/domains/school/service');
const { seedUsers, seedSchools } = require('../../seeds');

describe('SchoolService', () => {
    let superadmin, school;

    beforeEach(async () => {
        const users = await seedUsers();
        superadmin = users[0];
        const schools = await seedSchools(superadmin._id);
        school = schools[0];
    });

    describe('getSchools', () => {
        it('should return all schools for superadmin', async () => {
            const result = await SchoolService.getSchools({ role: 'superadmin' });
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Test School 1');
        });
    });

    describe('getSchoolById', () => {
        it('should return school by id for authorized user', async () => {
            const result = await SchoolService.getSchoolById(
                school._id,
                { role: 'superadmin' }
            );
            expect(result.name).toBe('Test School 1');
        });

        it('should throw error for non-existent school', async () => {
            await expect(
                SchoolService.getSchoolById(
                    new mongoose.Types.ObjectId(),
                    { role: 'superadmin' }
                )
            ).rejects.toThrow('School not found');
        });
    });
});
