-- name: GetPartnerByName :one
SELECT *
FROM partners
WHERE name = $1 LIMIT 1;

-- name: CreatePartner :one
INSERT INTO partners (
    name, logo_url, description, created_at, updated_at
) VALUES (
    $1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
RETURNING *;