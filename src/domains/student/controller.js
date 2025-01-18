const BaseController = require('../../core/base/base.controller');
const studentService = require('./service');

class StudentController extends BaseController {
    async createStudent(req, res) {
        try {
            const student = await studentService.createStudent(req.body, req.user);
            this.success(res, student, 201);
        } catch (error) {
            this.error(res, error, 400);
        }
    }

    async getStudents(req, res) {
        try {
            const filters = {
                schoolId: req.query.schoolId,
                classroomId: req.query.classroomId,
                status: req.query.status
            };
            
            // Remove undefined filters
            Object.keys(filters).forEach(key => 
                filters[key] === undefined && delete filters[key]
            );

            const students = await studentService.getStudents(req.user, filters);
            this.success(res, students);
        } catch (error) {
            this.error(res, error);
        }
    }

    async getStudentById(req, res) {
        try {
            const student = await studentService.getStudentById(req.params.id, req.user);
            this.success(res, student);
        } catch (error) {
            this.error(res, error);
        }
    }

    async updateStudent(req, res) {
        try {
            const student = await studentService.updateStudent(
                req.params.id,
                req.body,
                req.user
            );
            this.success(res, student);
        } catch (error) {
            this.error(res, error);
        }
    }

    async deleteStudent(req, res) {
        try {
            await studentService.deleteStudent(req.params.id, req.user);
            this.success(res, { message: 'Student deleted successfully' });
        } catch (error) {
            this.error(res, error);
        }
    }

    async transferStudent(req, res) {
        try {
            const student = await studentService.transferStudent(
                req.params.id,
                req.body.newClassroomId,
                req.user
            );
            this.success(res, student);
        } catch (error) {
            this.error(res, error);
        }
    }
}

module.exports = new StudentController();
