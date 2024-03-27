-- name: CreatePartner :one
INSERT INTO partners (
  name, logo_url, description 
) VALUES (
  $1, $2, $3
)
RETURNING *;

-- name: ListPartners :many
SELECT * FROM partners
ORDER BY name;

-- name: GetPartner :one
SELECT * FROM partners
WHERE id = $1 LIMIT 1;