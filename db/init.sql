create table images (
    id serial primary key,
    hash text not null,
    is_active boolean default false,
    url text default null,
    created_at timestamp default now()
);

create unique index idx_images_hash on images (hash);
