import pool from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

dotenv.config();

const saltRounds = `${process.env.SALT_ROUNDS}`;
const pepper = `${process.env.PEPPER}`;


export type User = {
    username: String;
    first_name: String;
    last_name: String;
    password: String;
}

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const sql = 'Select * from users';
            const res = await pool.query(sql);

            return res.rows;
        } catch (err) {
            throw new Error(`Could not get users: ${err}`);
        }
    }

    async show(username: string): Promise<User> {
        try {
            const sql = 'select * from users where username=$1';
            const res = await pool.query(sql, [username]);

            return res.rows[0];
        } catch (err) {
            throw new Error(`Could not show the user: ${err}`);
        }
    }

    async create(user: User): Promise<User> {
        try {
            const sql = 'insert into users (username, first_name, last_name, password) values($1, $2, $3, $4) returning *';
            const hashedPass = bcrypt.hashSync(user.password + pepper, parseInt(saltRounds));

            const res = await pool.query(sql, [user.username, user.first_name, user.last_name, hashedPass]);

            return res.rows[0];
        } catch (err) {
            throw new Error(`Could not create the user: ${err}`);
        }
    }

    async authenticate(username: string, password: string): Promise<User | null> {
        const sql = 'select * from users where username=$1';
        const res = await pool.query(sql, [username]);

        if (res.rows.length) {
            const user = res.rows[0];

            if (bcrypt.compareSync(password + pepper, user.password)) {
                return user;
            }
        }

        return null;
    }

    async delete(username: string): Promise<void> {
        try {
            const sql = 'delete from users where username=$1';
            const res = await pool.query(sql, [username]);
        } catch (err) {
            throw new Error(`Could not delete the user: ${err}`);
        }
    }
}
