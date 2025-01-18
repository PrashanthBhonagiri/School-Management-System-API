const classroomRepository = require('./repository');
const schoolService = require('../school/service');

class ClassroomService {
    async createClassroom(classroomData, user) {
        try {
            // Verify school access
            await schoolService.getSchoolById(classroomData.schoolId, user);
            return await classroomRepository.create(classroomData);
        } catch (error) {
            throw error;
        }
    }

    async getClassrooms(user, schoolId) {
        try {
            if (schoolId) {
                // Verify school access
                await schoolService.getSchoolById(schoolId, user);
                return await classroomRepository.findBySchool(schoolId);
            }
            
            if (user.role === 'superadmin') {
                return await classroomRepository.findAll();
            }
            
            // School admin can only see their school's classrooms
            const schools = await schoolService.getSchools(user);
            const schoolIds = schools.map(school => school._id);
            return await classroomRepository.findAll({ schoolId: { $in: schoolIds } });
        } catch (error) {
            throw error;
        }
    }

    async getClassroomById(id, user) {
        try {
            const classroom = await classroomRepository.findById(id);
            if (!classroom) {
                throw new Error('Classroom not found');
            }

            // Verify school access
            await schoolService.getSchoolById(classroom.schoolId, user);
            return classroom;
        } catch (error) {
            throw error;
        }
    }

    async updateClassroom(id, updateData, user) {
        try {
            const classroom = await this.getClassroomById(id, user);
            return await classroomRepository.update(id, updateData);
        } catch (error) {
            throw error;
        }
    }

    async deleteClassroom(id, user) {
        try {
            const classroom = await this.getClassroomById(id, user);
            return await classroomRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ClassroomService();
