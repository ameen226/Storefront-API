import supertest from 'supertest';
import bcrypt from 'bcrypt';
import env from 'dotenv';
import app from '../../server';
import { User, UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';

env.config();

const request = supertest(app);

const userStore = new UserStore();
const productStore = new ProductStore();

const userObj = {
    username: 'momo',
    firstname: 'mohamed',
    lastname: 'ali'
};

const userObjPass = '123456';

const productObj = {
    name: 'tedy_bear',
    price: 4,
    category: 'toys'
};

describe('the order handler', () => {
    beforeAll(async () => {
        const pepperedPassword = `${userObjPass}${process.env.PEPPER}`;
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS as string));
        const hashPassword = bcrypt.hashSync(pepperedPassword, salt);

        const user: User = {
            username: userObj.username,
            first_name: userObj.firstname,
            last_name: userObj.lastname,
            password: hashPassword as string,
        };

        await userStore.create(user);

        await productStore.create(productObj);
    });

    it('should return success for creating an order', async () => {
        const res = await request
            .post('/orders')
            .auth(process.env.TEST_TOKEN as string, { type: "bearer" })
            .send({ status: 'active', userId: 1 });

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });

    it('should return sucess for showing all orders', async () => {
        const res = await request.get('/orders')
            .auth(process.env.TEST_TOKEN as string, { type: "bearer" });

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });

    it('should return success for showing order by userId', async () => {
        const res = await request.get('/orders/1')
            .auth(process.env.TEST_TOKEN as string, { type: "bearer" });

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });

    it('should return success for showing the completed orders by username', async () => {
        const res = await request
            .get('/orders/complete/momo')
            .auth(process.env.TEST_TOKEN as string, { type: "bearer" });

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });


    it('should return success for adding products to orders', async () => {
        const res = await request
            .post('/orders/products')
            .auth(process.env.TEST_TOKEN as string, { type: "bearer" })
            .send({ order_id: 1, product_id: 1, product_quantity: 4 });;


        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });


    it('should retrun success for deleteing the order product', async () => {
        const res = await request
            .delete('/orders/products/1')
            .auth(process.env.TEST_TOKEN as string, { type: "bearer" })

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });

    it('should return success for deleting the order', async () => {
        const res = await request
            .delete('/orders/1')
            .auth(process.env.TEST_TOKEN as string, { type: "bearer" })

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });

    afterAll(async () => {
        await productStore.delete(productObj.name);
        await userStore.delete(userObj.username);
    });
});