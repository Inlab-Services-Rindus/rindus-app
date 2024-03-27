-- name: CreateLanguage :one
INSERT INTO languages (
  name
) VALUES (
  $1
)
RETURNING *;

-- name: ListLanguages :many
SELECT * FROM languages
ORDER BY name;

-- name: GetLanguage :one
SELECT * FROM languages
WHERE id = $1 LIMIT 1;