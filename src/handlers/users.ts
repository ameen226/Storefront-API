import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';

const store = new UserStore();


const usersRoutes = (app: express.Application) => {
    app.get('/users', index);
    app.get('/users/:username', show);
    app.post('/users/signup', create);
    app.post('/users/signin', authenticate);
    app.delete('/users/:username', deleteUser)
}

const index = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json('Access denied, Token missing');
        }

        jwt.verify(token as string, process.env.JWT_SECRET as string);

        const users = await store.index();
        res.json(users);
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

        const user = await store.show(req.params.username);
        res.json(user);
    } catch (err) {
        res.status(401).json('Access denied, invalid Token');
    }


}

const create = async (req: Request, res: Response) => {
    const user: User = {
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password
    }

    try {
        const newUser = await store.create(user);
        const token = await jwt.sign({ user: newUser }, process.env.JWT_SECRET as string);
        res.json({ new_user: newUser, jwt_token: token });
    } catch (err) {
        res.status(400).json(err as string + user);
    }
}

const authenticate = async (req: Request, res: Response) => {
    const user: User = {
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password
    }

    try {
        const resUser = await store.authenticate(user.username as string, user.password as string);
        if (!resUser) {
            return res.status(400).json('Wrong user name or wrong password');
        }

        const token = await jwt.sign({ user: resUser }, process.env.JWT_SECRET as string);


        res.json(token);
    } catch (err) {
        res.status(401).json({ err });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        await store.delete(req.params.username);
        res.json(`User ${req.params.username} deleted`);
    } catch (err) {
        res.status(400).json(err);
    }
}

export default usersRoutes;