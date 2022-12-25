import pool from '../database';



export type Order = {
    status: String,
    user_id: Number,
}

export type OrderProduct = {
    order_id: Number,
    product_id: Number,
    product_quantity: Number
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const sql = 'select * from orders';
            const orders = await pool.query(sql);

            return orders.rows;
        } catch (err) {
            throw new Error(`Could not get orders: ${err}`);
        }
    }

    async show(userId: string): Promise<Order> {
        try {
            const sql = 'select * from orders where user_id=$1';
            const order = await pool.query(sql, [userId]);

            return order.rows[0];
        } catch (err) {
            throw new Error(`Could not get the order: ${err}`);
        }
    }

    async create(username: string, status: string): Promise<Order> {
        try {
            let sql = 'select id from users where username=$1';
            const result = await pool.query(sql, [username]);
            const id = result.rows[0].id;

            sql = 'insert into orders (user_id, status) values($1, $2) returning *';
            const newOrder = await pool.query(sql, [id, status]);

            return newOrder.rows[0];
        } catch (err) {
            throw new Error(`Could not create the order: ${err}`);
        }
    }

    async addProductsToOrders(product: OrderProduct): Promise<OrderProduct> {
        try {
            const sql = 'insert into order_products (order_id, product_id, product_quantity) values ($1, $2, $3) returning *';
            const productsOrder = await pool.query(sql, [product.order_id, product.product_id, product.product_quantity]);

            return productsOrder.rows[0];
        } catch (err) {
            throw new Error(`Could not add products to order: ${err}`);
        }
    }

    async showCompletedOrdersByUser(username: string): Promise<Order[]> {
        try {
            const sql = 'select orders.id, username, status, user_id from orders inner join users on orders.user_id = users.id where users.username=$1 and orders.status=$2';
            const order = await pool.query(sql, [username, 'Completed']);

            return order.rows;
        } catch (err) {
            throw new Error(`Could not get the completed orders by the user: ${err}`);
        }
    }

    async deleteOrder(orderId: string): Promise<void> {
        try {
            const sql = 'delete from orders where id=$1';
            const res = await pool.query(sql, [orderId]);

        } catch (err) {
            throw new Error(`Could not delete the order: ${err}`);
        }
    }

    async deleteOrderProduct(orderProductId: string): Promise<void> {
        try {
            const sql = 'delete from order_products where id=$1';
            const res = await pool.query(sql, [orderProductId]);
        } catch (err) {
            throw new Error(`Could not delete the order product: ${err}`);
        }
    }

}