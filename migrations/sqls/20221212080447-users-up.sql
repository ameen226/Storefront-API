create table users (
    id serial primary key,
    username varchar(50) unique not null,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    password varchar(100) not null
);