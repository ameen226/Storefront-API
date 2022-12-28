import supertest from 'supertest';
import env from 'dotenv';
import app from '../../server';

env.config();

const request = supertest(app);

const productObj = {
    name: 'tedy_bear',
    price: 8,
    category: 'toys'
};

describe('the product handler', () => {
    it('should return succes for creating a product', async () => {
        const res = await request
            .post('/products')
            .auth(process.env.TEST_TOKEN as string, { type: "bearer" })
            .send(productObj);

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });

    it('should return a success for showing all the products', async () => {
        const res = await request.get('/products');

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
    });

    it('should return success for showing a specific product by its name', async () => {
        const response = await request
            .get('/products/tedy_bear');

        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
    });

    it('should return success for deleting a product by its name', async () => {
        const response = await request
            .delete('/products/tedy_bear')
            .auth(process.env.TEST_TOKEN as string, { type: "bearer" })

        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
    });
});