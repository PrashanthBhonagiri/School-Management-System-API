const BaseController = require('../../core/base/base.controller');
const schoolService = require('./service');

class SchoolController extends BaseController {
    async createSchool(req, res) {
        try {
            const school = await schoolService.createSchool(req.body, req.user.id);
            this.success(res, school, 201);
        } catch (error) {
            this.error(res, error, 400);
        }
    }

    async getSchools(req, res) {
        try {
            const schools = await schoolService.getSchools(req.user);
            this.success(res, schools);
        } catch (error) {
            this.error(res, error);
        }
    }

    async getSchoolById(req, res) {
        try {
            const school = await schoolService.getSchoolById(req.params.id, req.user);
            this.success(res, school);
        } catch (error) {
            this.error(res, error);
        }
    }

    async updateSchool(req, res) {
        try {
            const school = await schoolService.updateSchool(
                req.params.id,
                req.body,
                req.user
            );
            this.success(res, school);
        } catch (error) {
            this.error(res, error);
        }
    }

    async deleteSchool(req, res) {
        try {
            await schoolService.deleteSchool(req.params.id, req.user);
            this.success(res, { message: 'School deleted successfully' });
        } catch (error) {
            this.error(res, error);
        }
    }
}

module.exports = new SchoolController();
