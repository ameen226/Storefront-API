create table order_products (
    id serial primary key,
    order_id int not null,
    product_id int not null,
    product_quantity int not null default 1,
    foreign key (order_id) references orders(id) on delete cascade on update cascade,
    foreign key (product_id) references products(id) on delete cascade on update cascade
);