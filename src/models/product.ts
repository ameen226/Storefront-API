import express from 'express';
import pool from '../database';

export type Product = {
    name: String;
    price: Number | string;
    category: String;
}

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const sql = 'select * from products';
            const res = await pool.query(sql);

            return res.rows;
        } catch (err) {
            throw new Error(`Could not list the products: ${err}`);
        }
    }

    async show(name: string): Promise<Product> {
        try {
            const sql = 'select * from products where name = $1';
            const res = await pool.query(sql, [name]);

            return res.rows[0];
        } catch (err) {
            throw new Error(`Could not find the product: ${err}`);
        }
    }

    async create(prod: Product): Promise<Product> {
        try {
            const sql = 'insert into products (name, price, category) values($1, $2, $3) returning *';
            const res = await pool.query(sql, [prod.name, prod.price, prod.category]);

            return res.rows[0];
        } catch (err) {
            throw new Error(`Could not create the product: ${err}`);
        }
    }

    async delete(productName: string): Promise<void> {
        try {
            const sql = 'delete from products where name=$1';
            await pool.query(sql, [productName]);
        } catch (err) {
            throw new Error(`Could not delete the product: ${err}`);
        }
    }
}


