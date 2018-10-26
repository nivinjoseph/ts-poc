CREATE DATABASE tspocdb;

create table todos
(
    id varchar (48) primary key,
    version int not null,
    created_at bigint not null,
    updated_at bigint not null,
    data jsonb not null
);