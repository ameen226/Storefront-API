import bcrypt from "bcrypt";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { User, UserStore } from "../user";


env.config();

const store = new UserStore();

const userObj = {
    username: 'ameen266',
    first_name: 'ameen',
    last_name: "mohamed",
};

const userObjPass = '123456';

describe('the user model', () => {
    it('should have an index methode', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show methode', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create methode', () => {
        expect(store.create).toBeDefined();
    });

    it('should have a authenticate methode', () => {
        expect(store.authenticate).toBeDefined();
    });

    it('should have a delete methode ', () => {
        expect(store.delete).toBeDefined();
    });

    it('should create a user', async () => {
        const pepperedPassword = `${userObjPass}${process.env.PEPPER}`;
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS as string));
        const hashPassword = bcrypt.hashSync(pepperedPassword, salt);

        const user: User = {
            username: userObj.username,
            first_name: userObj.first_name,
            last_name: userObj.last_name,
            password: hashPassword as string,
        };

        const { username } = await store.create(user);

        expect({ username }).toEqual({
            username: userObj.username,
        });
    });

    it('should index all the users', async () => {
        const users = await store.index();
        const { first_name, last_name, username } = users[0];

        expect([{ username, first_name, last_name }]).toEqual([{ username: '7amada', first_name: 'mohamed', last_name: 'khalil' }]);
    });

    it('should show a specific user', async () => {
        const { username, first_name, last_name } = await store.show(
            userObj.username
        );

        expect({ username, first_name, last_name }).toEqual(userObj);
    });

    it('should authenticate the user', async () => {
        const user = await store.authenticate(userObj.username, userObjPass);
        expect(user).toBeDefined();
    });

    it('should delete the user', async () => {
        await store.delete(userObj.username);
        const result = await store.show(userObj.username);

        // @ts-ignore
        expect(result).toBe(undefined);
    });
});