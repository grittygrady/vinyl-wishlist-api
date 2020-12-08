BEGIN;

CREATE TABLE records (
  id VARCHAR PRIMARY KEY,
  title TEXT NOT NULL,
  owner_id VARCHAR REFERENCES users(username)
);

COMMIT;