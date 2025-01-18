const BaseController = require('../../core/base/base.controller');
const classroomService = require('./service');

class ClassroomController extends BaseController {
    async createClassroom(req, res) {
        try {
            const classroom = await classroomService.createClassroom(req.body, req.user);
            this.success(res, classroom, 201);
        } catch (error) {
            this.error(res, error, 400);
        }
    }

    async getClassrooms(req, res) {
        try {
            const classrooms = await classroomService.getClassrooms(req.user, req.query.schoolId);
            this.success(res, classrooms);
        } catch (error) {
            this.error(res, error);
        }
    }

    async getClassroomById(req, res) {
        try {
            const classroom = await classroomService.getClassroomById(req.params.id, req.user);
            this.success(res, classroom);
        } catch (error) {
            this.error(res, error);
        }
    }

    async updateClassroom(req, res) {
        try {
            const classroom = await classroomService.updateClassroom(
                req.params.id,
                req.body,
                req.user
            );
            this.success(res, classroom);
        } catch (error) {
            this.error(res, error);
        }
    }

    async deleteClassroom(req, res) {
        try {
            await classroomService.deleteClassroom(req.params.id, req.user);
            this.success(res, { message: 'Classroom deleted successfully' });
        } catch (error) {
            this.error(res, error);
        }
    }
}

module.exports = new ClassroomController();
