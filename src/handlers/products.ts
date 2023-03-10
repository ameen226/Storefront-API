import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

const store = new ProductStore();


const productsRoutes = (app: express.Application) => {
    app.get('/products', index);
    app.get('/products/:name', show);
    app.post('/products', create);
    app.delete('/products/:productName', deleteProduct);
}

const index = async (req: Request, res: Response) => {
    try {
        const products = await store.index();
        res.json(products);
    } catch (err) {
        res.status(400).json(err);
    }
}

const show = async (req: Request, res: Response) => {
    try {
        const product = await store.show(req.params.name);
        res.json(product);
    } catch (err) {
        res.status(400).json(err);
    }
}

const create = async (req: Request, res: Response) => {

    const product: Product = {
        name: req.body.name,
        price: parseInt(req.body.price),
        category: req.body.category
    }

    try {

        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json('Access denied, Token missing');
        }

        jwt.verify(token as string, process.env.JWT_SECRET as string);

    } catch (err) {
        return res.status(401).json('Access denied, invalid token');
    }
    try {
        const newProduct = await store.create(product);
        res.json(newProduct);
    } catch (err) {
        res.status(400).json(err);
    }
}


const deleteProduct = async (req: Request, res: Response) => {
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
        await store.delete(req.params.name);
        res.json('Product Deleted');
    } catch (err) {
        res.status(400).json(err);
    }
}

export default productsRoutes;