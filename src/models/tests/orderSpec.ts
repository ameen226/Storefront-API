import { ProductStore } from "../product";
import { User, UserStore } from "../user";
import { OrderStore } from "../order";


import bcrypt from "bcrypt";
import env from "dotenv";

env.config();


const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();

const userObj = {
    firstname: 'ameen',
    lastname: 'mohamed',
    username: 'ameen266',
};

const userObjPass = '123456';

const productObj = {
    name: 'rubber duck',
    price: 2,
    category: 'toys'
};

describe('The order model', () => {
    beforeAll(async () => {
        const modPassword = `${userObjPass}${process.env.PERPPER}`;
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS as string));
        const hashedPassword = bcrypt.hashSync(modPassword, salt);

        const user: User = {
            username: userObj.username,
            first_name: userObj.firstname,
            last_name: userObj.lastname,
            password: hashedPassword as string,
        }

        await userStore.create(user);
        await productStore.create(productObj);
    });

    it("should have an index method", () => {
        expect(orderStore.index).toBeDefined();
    });

    it("should have a show method", () => {
        expect(orderStore.show).toBeDefined();
    });

    it("should have a create method", () => {
        expect(orderStore.create).toBeDefined();
    });


    it("should create an order", async () => {

        const obj = {
            username: "ameen266",
            status: "Active"
        }

        const { user_id, status } = await orderStore.create(obj.username, obj.status);

        expect({ user_id, status }).toEqual({
            user_id: 1,
            status: 'shipped'
        });
    });

    it("should index all the orders", async () => {

        const [{ user_id, status }] = await orderStore.index();

        expect({ user_id, status }).toEqual({
            user_id: 1,
            status: "Active",
        });
    });

    it("it should show the order of a specific user", async () => {

        const { user_id, status } = await orderStore.show('1');

        expect({ user_id, status }).toEqual({
            user_id: 1,
            status: "Active",
        });
    });

    it("should add products to an order", async () => {

        const { order_id, product_id, product_quantity } = await orderStore.addProductsToOrders({
            order_id: 1,
            product_id: 1,
            product_quantity: 3
        });

        expect({ order_id, product_id, product_quantity }).toEqual({
            order_id: 1,
            product_id: 1,
            product_quantity: 6
        });
    });

    it("should show completed orders by the user", async () => {
        const result = await orderStore.showCompletedOrdersByUser(userObj.username);
        expect(result).toBeDefined();
    });


    afterAll(async () => {
        await orderStore.deleteOrderProduct("1");
        await productStore.delete(productObj.name);
        await orderStore.deleteOrder("1");
        await userStore.delete(userObj.username);
    });

});