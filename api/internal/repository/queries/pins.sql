-- name: CreatePinCategory :one
INSERT INTO pins_category (
    name,
    created_at,
    updated_at
) VALUES (
    $1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
RETURNING *;
