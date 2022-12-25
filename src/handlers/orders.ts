import express, { Request, Response } from 'express';
import { Order, OrderProduct, OrderStore } from '../models/order';
import env from 'dotenv';
import jwt from 'jsonwebtoken';

env.config();

const store = new OrderStore();


const ordersRoutes = (app: express.Application) => {
    app.get('/orders', index);
    app.get('/orders/:userId', show);
    app.post('/orders', create);
    app.get('/orders/complete/:username', showCompletedOrdersByUser);
    app.delete('/orders/:orderId', deleteOrder);
    app.post('/orders/products', addProductsToOrders);
    app.delete('/orders/products/:productOrderId', deleteOrderProduct);
}


const index = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json('Access denied, Token missing');
        }

        jwt.verify(token as string, process.env.JWT_SECRET as string);

        const orders = await store.index();
        res.json(orders);
    } catch (err) {
        res.status(401).json('Access denied, invalid Token');
    }
}

const show = async (req: Request, res: Response) => {

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json('Access denied, Token missing');
        }

        jwt.verify(token as string, process.env.JWT_SECRET as string);

    } catch (err) {
        return res.status(401).json('Access denied, invalid Token');
    }

    try {
        const order = await store.show(req.params.userId);
        res.json(order);
    } catch (err) {
        res.status(400).json(err);
    }
}

const create = async (req: Request, res: Response) => {

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json('Access denied, missing Token');
        }

        jwt.verify(token as string, process.env.JWT_SECRET as string);
    } catch (err) {
        return res.status(401).json('Access denied, invalid Token');
    }

    try {
        const newOrder = await store.create(req.body.username, req.body.status);
        res.json(newOrder);
    } catch (err) {
        res.status(400).json(err);
    }
}

const addProductsToOrders = async (req: Request, res: Response) => {

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json('Access denied, missing Token');
        }

        jwt.verify(token as string, process.env.JWT_SECRET as string);
    } catch (err) {
        return res.status(401).json('Access denied, invalid Token');
    }

    try {
        const orderProduct: OrderProduct = {
            order_id: req.body.order_id as number,
            product_id: req.body.product_id as number,
            product_quantity: req.body.product_quantity as number
        }

        const result = await store.addProductsToOrders(orderProduct);

        res.json(result);
    } catch (err) {
        res.status(400).json(err);
    }
}

const showCompletedOrdersByUser = async (req: Request, res: Response) => {

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json('Access denied, missing Token');
        }

        jwt.verify(token as string, process.env.JWT_SECRET as string);
    } catch (err) {
        return res.status(401).json('Access denied, inavlid Token');
    }

    try {
        const ordersByUser = await store.showCompletedOrdersByUser(req.params.username);

        res.json(ordersByUser);
    } catch (err) {
        res.status(400).json(err);
    }
}


const deleteOrder = async (req: Request, res: Response) => {

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json('Access denied, Token missing');
        }

        jwt.verify(token as string, process.env.JWT_SECRET as string);

    } catch (err) {
        return res.status(401).json('Access denied, invalid Token');
    }

    try {
        await store.deleteOrder(req.params.orderId);
        res.json('Order deleted');
    } catch (err) {
        res.status(400).json(err);
    }
}

const deleteOrderProduct = async (req: Request, res: Response) => {

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json('Access denied, Token missing');
        }

        jwt.verify(token as string, process.env.JWT_SECRET as string);

    } catch (err) {
        return res.status(401).json('Access denied, invalid Token');
    }

    try {
        await store.deleteOrderProduct(req.params.orderProductsId);
        res.json('Order product deleted');
    } catch (err) {
        res.status(400).json(err);
    }
}

export default ordersRoutes;