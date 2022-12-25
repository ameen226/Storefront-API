create table orders (
    id serial primary key,
    user_id int not null,
    status varchar not null,
    foreign key (user_id) references users(id) on delete cascade on update cascade
);