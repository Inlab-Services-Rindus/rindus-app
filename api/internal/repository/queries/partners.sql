-- name: GetPartnerByName :one
SELECT *
FROM partners
WHERE name = $1 LIMIT 1;

-- name: CreatePartner :one
INSERT INTO partners (
    name, logo_url, description
) VALUES (
    $1, $2, $3
)
RETURNING *;