# Storefront Project

This api is used for imitating a storefront as we have products and users can register and sign in and also we have orders records.

## Usage 

- Visit the end points in the end points section written bellow

#### Initialize PostgreSQL and connect to database

```shell
# start PostgreSQL
$ psql -U postgres

# create database for dev env
$ CREATE DATABASE storefront_dev;
```


## Scripts

* (npm i): for installing all the dependencies
* (npm run start): for transpiling from typescript to javascript code and running the server
* (npm run test): for creating databse for testing, building the project and then testing using jasmine and supertest


## API Endpoints

`GET /` - homepage

`GET /products` - index all products\
`GET /products/:productName` - show a specific product by product name\
`POST /products` - create a product
`DELETE /products/:productName` - delete product by product name

`GET /users` - index all users
`GET /users/:username` - show a specific user by username
`POST /users/signup` - create user
`POST /users/signin` - sign in a user
`DELETE /users/:username` - delete a specific user by username

`GET /orders` - index all orders
`GET /orders/:userId` - index orders by user id
`POST /orders` - create order 
`GET /orders/complete/:username` - index copmleted orders by username   
`DELETE /orders/:orderId` - delete a specific order by order id
`POST /orders/products` - create order with product quantity and product id 
`DELETE /orders/products/:productOrderId` - delete order product by order product id


#### Products
- Index
- Show 
- Create (args: name, price, category) [token required]
- Delete (path the product name in the paramas) [token required]

#### Users
- Index [token required]
- Show (path the username in the params) [token required]
- Create (args: username, first_name, last_name, password)
- Delete (path the username in the params)

#### Orders
- Index [token required]
- Show (path the username in the params) [token required]
- Create order (args: username, status) [token required]
- Delete (path the order id in the params) [token required]
- Create order with product quantity and product id (args: order_id, product_id, product_quantity) [token required]
- Show completed orders by user (path the username in the params) [token required]
- Delete order product (path the order products id) [token required]






```shell

PORT=3000

ENV=dev

POSTGRES_HOST=localhost
DEV_DB=storefront_dev
TEST_DB=storefront_test
POSTGRES_USER=postgres
POSTGRES_PASS=postgres

SALT_ROUNDS=10
PEPPER=unga-bunga
JWT_SECRET=whatdafuckisgoingon


TEST_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo5LCJ1c2VybmFtZSI6IjdhbWFkYSIsImZpcnN0X25hbWUiOiJtb2hhbWVkIiwibGFzdF9uYW1lIjoia2hhbGlsIiwicGFzc3dvcmQiOiIkMmIkMTAkZjNES2s0V0h1VDhnbEhVTURVbFAuLnVkUTk3Z2FuUjNDV2tJbHdDb0JML3FhZm16ZmhaSy4ifSwiaWF0IjoxNjcyMDczNjUwfQ.F39QMEN7aVEjJoNvC7hT-QLI6EqE98ITiSkjzN50DGY

```

## Database Schema


``` shell
Table "public.products"
 Column |          Type          | Collation | Nullable |               Default                
--------+------------------------+-----------+----------+--------------------------------------
 id       | integer                |           | not null | nextval('products_id_seq'::regclass)
 name     | character varying(50)  |           | not null | 
 price    | numeric                |           | not null | 
 category | character varying(50)  |           |          | 
Indexes:
    "products_pkey" PRIMARY KEY, btree (id)
Referenced by:
    TABLE "order_products" CONSTRAINT "order_products_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
Access method: heap
```

```shell
Table "public.users"
Column    |          Type           | Collation | Nullable |              Default              
----------+-------------------------+-----------+----------+-----------------------------------
id        | integer                 |           | not null | nextval('users_id_seq'::regclass)
username  | character varying(50)   |           | not null |
first_name| character varying(50)   |           | not null |
last_name | character varying(50)   |           | not null |
password  | character varying(100)  |           | not null |
Indexes:
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE "orders" CONSTRAINT "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
Access method: heap
```



```shell
Table "public.orders"
Column  |          Type          | Collation | Nullable |              Default               
--------+------------------------+-----------+----------+--------------------------------------
id      | integer                |           | not null | nextval('orders_id_seq'::regclass)
user_id | integer                |           | not null |
status  | character varying      |           | not null |
Indexes:
    "orders_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
Referenced by:
    TABLE "order_products" CONSTRAINT "order_products_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE
Access method: heap
```


```shell
Table "public.order_products"
Column             |  Type   | Collation | Nullable |                  Default                   
-------------------+---------+-----------+----------+--------------------------------------------------
id                 | integer |           | not null | nextval('order_products_id_seq'::regclass)
order_id           | integer |           | not null |
product_id         | integer |           | not null |
product_quantity   | integer |           | not null |
Indexes:
    "order_products_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "order_products_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE
    "order_products_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
Access method: heap
```


