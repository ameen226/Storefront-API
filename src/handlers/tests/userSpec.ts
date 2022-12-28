import supertest from 'supertest';
import env from 'dotenv';
import app from '../../server';

env.config();

const request = supertest(app);

const userObj = {
    username: '7amada',
    firstname: 'mohamed',
    lastname: 'khalil',
    password: '123456',
};


describe('the user handler', () => {
    it('should sign up a user sucessfully', async () => {
        const res = await request.post('/users/signup').send(userObj);

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });

    it('should return sucess for gettin all users', async () => {
        const res = await request
            .get('/users')
            .auth(process.env.TEST_TOKEN as string, { type: "bearer" });

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });

    it('should return sucess for showing a user', async () => {
        const res = await request
            .get('/users/7amada')
            .auth(process.env.TEST_TOKEN as string, { type: "bearer" })

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });

    it('should return success for authenticating a user', async () => {
        const res = await request.post('/users/login').send({
            username: userObj.username,
            password: userObj.password,
        });

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });

    it('should return sucess for deleting a user', async () => {
        const response = await request.delete('/users/7amada');

        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
    });
});