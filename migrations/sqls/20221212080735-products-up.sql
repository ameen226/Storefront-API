create table products (
    id serial primary key,
    name varchar(50) not null,
    price decimal not null,
    category varchar(50)
);