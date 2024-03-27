-- name: CreateOffice :one
INSERT INTO offices (
  name
) VALUES (
  $1
)
RETURNING *;

-- name: ListOffices :many
SELECT * FROM offices
ORDER BY name;

-- name: GetOffice :one
SELECT * FROM offices
WHERE id = $1 LIMIT 1;