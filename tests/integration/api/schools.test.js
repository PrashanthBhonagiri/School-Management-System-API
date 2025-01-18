const App = require('../../../src/presentation/http/app');
const { testRequest, generateAuthToken } = require('../../helpers');
const { seedUsers, seedSchools } = require('../../seeds');

describe('Schools API', () => {
    let app, superadmin, school, authToken;

    beforeAll(async () => {
        app = await new App().init();
    });

    beforeEach(async () => {
        const users = await seedUsers();
        superadmin = users[0];
        const schools = await seedSchools(superadmin._id);
        school = schools[0];
        authToken = generateAuthToken(superadmin);
    });

    describe('GET /api/schools', () => {
        it('should return all schools for authenticated superadmin', async () => {
            const response = await testRequest(app)
                .get('/api/schools')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].name).toBe('Test School 1');
        });

        it('should return 401 for unauthenticated request', async () => {
            const response = await testRequest(app)
                .get('/api/schools');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/schools', () => {
        it('should create a new school for authenticated superadmin', async () => {
            const newSchool = {
                name: 'New Test School',
                address: {
                    street: '456 Test St',
                    city: 'Test City',
                    state: 'TS',
                    zipCode: '12345'
                },
                contactInfo: {
                    email: 'newschool@test.com',
                    phone: '+1-234-567-8902'
                }
            };

            const response = await testRequest(app)
                .post('/api/schools')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newSchool);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(newSchool.name);
        });
    });
});
