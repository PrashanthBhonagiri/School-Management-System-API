const schoolRepository = require('./repository');

class SchoolService {
    async createSchool(schoolData, userId) {
        try {
            const schoolWithAdmin = {
                ...schoolData,
                adminIds: [userId]
            };
            return await schoolRepository.create(schoolWithAdmin);
        } catch (error) {
            throw error;
        }
    }

    async getSchools(user) {
        try {
            if (user.role === 'superadmin') {
                return await schoolRepository.findAll();
            }
            return await schoolRepository.findByAdminId(user.id);
        } catch (error) {
            throw error;
        }
    }

    async getSchoolById(id, user) {
        try {
            const school = await schoolRepository.findById(id);
            if (!school) {
                throw new Error('School not found');
            }

            if (user.role !== 'superadmin' && 
                !school.adminIds.some(adminId => adminId.equals(user.id))) {
                throw new Error('Not authorized to access this school');
            }

            return school;
        } catch (error) {
            throw error;
        }
    }

    async updateSchool(id, updateData, user) {
        try {
            const school = await this.getSchoolById(id, user);
            return await schoolRepository.update(id, updateData);
        } catch (error) {
            throw error;
        }
    }

    async deleteSchool(id, user) {
        try {
            const school = await this.getSchoolById(id, user);
            return await schoolRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SchoolService();
