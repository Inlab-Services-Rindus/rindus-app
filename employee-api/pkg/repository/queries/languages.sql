-- name: CreateLanguage :one
INSERT INTO languages (
  id, name
) VALUES (
  $1, $2
)
RETURNING *;

-- name: ListLanguages :many
SELECT id, name FROM languages
ORDER BY name;

-- -- name: CreateOffice :one
-- INSERT INTO offices (
--   id, name
-- ) VALUES (
--   $1, $2
-- )
-- RETURNING *;

-- -- name: CreatePartner :one
-- INSERT INTO partners (
--   id, name, logo_url, description
-- ) VALUES (
--   $1, $2, $3, $4
-- )
-- RETURNING *;
