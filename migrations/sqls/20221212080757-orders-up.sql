create table orders (
    id serial primary key,
    product_id integer not null,
    quantity integer default 1,
    user_id integer not null,
    status varchar not null,

    foreign key (product_id) references products(id) on delete cascade on update cascade,
    foreign key (user_id) references users(id) on delete cascade on update cascade
)