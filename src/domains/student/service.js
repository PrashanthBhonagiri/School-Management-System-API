const studentRepository = require('./repository');
const schoolService = require('../school/service');
const classroomService = require('../classroom/service');

class StudentService {
    async createStudent(studentData, user) {
        try {
            // Verify school and classroom access
            await schoolService.getSchoolById(studentData.schoolId, user);
            await classroomService.getClassroomById(studentData.classroomId, user);

            // Generate admission number
            studentData.admissionNumber = await studentRepository.generateAdmissionNumber(
                studentData.schoolId
            );

            return await studentRepository.create(studentData);
        } catch (error) {
            throw error;
        }
    }

    async getStudents(user, filters = {}) {
        try {
            if (user.role === 'superadmin') {
                return await studentRepository.findAll(filters);
            }

            // School admin can only see their school's students
            const schools = await schoolService.getSchools(user);
            const schoolIds = schools.map(school => school._id);
            return await studentRepository.findAll({ 
                ...filters, 
                schoolId: { $in: schoolIds } 
            });
        } catch (error) {
            throw error;
        }
    }

    async getStudentById(id, user) {
        try {
            const student = await studentRepository.findById(id);
            if (!student) {
                throw new Error('Student not found');
            }

            // Verify school access
            await schoolService.getSchoolById(student.schoolId, user);
            return student;
        } catch (error) {
            throw error;
        }
    }

    async updateStudent(id, updateData, user) {
        try {
            const student = await this.getStudentById(id, user);
            
            if (updateData.classroomId) {
                // Verify new classroom access
                await classroomService.getClassroomById(updateData.classroomId, user);
            }

            return await studentRepository.update(id, updateData);
        } catch (error) {
            throw error;
        }
    }

    async deleteStudent(id, user) {
        try {
            const student = await this.getStudentById(id, user);
            return await studentRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    async transferStudent(id, newClassroomId, user) {
        try {
            const student = await this.getStudentById(id, user);
            await classroomService.getClassroomById(newClassroomId, user);

            return await studentRepository.update(id, {
                classroomId: newClassroomId,
                'academicInfo.rollNumber': await this.generateNewRollNumber(newClassroomId)
            });
        } catch (error) {
            throw error;
        }
    }

    async generateNewRollNumber(classroomId) {
        const students = await studentRepository.findByClassroom(classroomId);
        const maxRoll = Math.max(...students.map(s => 
            parseInt(s.academicInfo.rollNumber) || 0
        ));
        return String(maxRoll + 1).padStart(2, '0');
    }
}

module.exports = new StudentService();
