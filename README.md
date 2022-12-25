# Storefront Project

This api is used for imitating a storefront as we have products and users the register and sign in and also we have orders records.

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
* (npm run test): for testing using jasmine and supertest (unfortunately i did not complete the tests because i ran into some bugs and i did not have much time)


## API Endpoints

`GET /` - homepage

`GET /products` - index all products\
`GET /products/:productName` - show a specific product by product name\
`POST /products` - create a product
`DELETE /products` - delete product by product name

`GET /users` - index all users
`GET /users/:username` - show a specific user by username
`POST /users/register` - create user
`POST /users/login` - sign in a user
`DELETE /users` - delete a specific user by username

`GET /orders` - index all orders
`GET /orders/:userId` - index orders by user id
`POST /orders` - create order 
`GET /orders/complete/:username` - index copmleted orders by username   
`DELETE /orders` - delete a specific order by order id
`POST /orders/products` - create order with product quantity and product id
`DELETE /orders/products` - delete order product by order product id