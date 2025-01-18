const App = require('../../../src/presentation/http/app');
const { testRequest } = require('../../helpers');
const { seedUsers } = require('../../seeds');

describe('Auth API', () => {
    let app;

    beforeAll(async () => {
        app = await new App().init();
    });

    beforeEach(async () => {
        await seedUsers();
    });

    describe('POST /api/auth/login', () => {
        it('should authenticate valid user', async () => {
            const response = await testRequest(app)
                .post('/api/auth/login')
                .send({
                    email: 'superadmin@test.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('token');
        });

        it('should reject invalid credentials', async () => {
            const response = await testRequest(app)
                .post('/api/auth/login')
                .send({
                    email: 'superadmin@test.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});
