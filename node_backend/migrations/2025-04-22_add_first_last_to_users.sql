-- migrations/2025-04-22_add_first_last_to_users.sql

ALTER TABLE public.users
  ADD COLUMN first_name VARCHAR(255) NOT NULL DEFAULT '',
  ADD COLUMN last_name  VARCHAR(255) NOT NULL DEFAULT '';
