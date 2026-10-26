create table if not exists users (
  id serial primary key,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz default now()
);

create table if not exists notes (
  id serial primary key,
  user_id int not null references users(id) on delete cascade,
  title text not null,
  body text not null default '',
  created_at timestamptz default now(),
  unique (user_id, title)
);

create table if not exists note_links (
  from_id int references notes(id) on delete cascade,
  to_id int references notes(id) on delete cascade,
  primary key (from_id, to_id)
);

create table if not exists cards (
  id serial primary key,
  user_id int not null references users(id) on delete cascade,
  note_id int references notes(id) on delete cascade,
  question text not null,
  answer text not null,
  ease real not null default 2.5,
  interval_days int not null default 0,
  due_at timestamptz not null default now()
);

create table if not exists tags (
  id serial primary key,
  user_id int not null references users(id) on delete cascade,
  name text not null,
  unique (user_id, name)
);

create table if not exists note_tags (
  note_id int references notes(id) on delete cascade,
  tag_id int references tags(id) on delete cascade,
  primary key (note_id, tag_id)
);

create index if not exists cards_user_due_idx on cards (user_id, due_at);
create index if not exists note_links_to_idx on note_links (to_id);
create index if not exists note_tags_tag_idx on note_tags (tag_id);
