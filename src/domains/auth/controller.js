const BaseController = require('../../core/base/base.controller');
const authService = require('./service');

class AuthController extends BaseController {
    async register(req, res) {
        try {
            const result = await authService.register(req.body);
            this.success(res, result, 201);
        } catch (error) {
            this.error(res, error, 400);
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            this.success(res, result);
        } catch (error) {
            this.error(res, error, 401);
        }
    }
}

module.exports = new AuthController();
