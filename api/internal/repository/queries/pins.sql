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

-- name: GetPinCategories :many
SELECT * FROM pins_category WHERE deleted_at IS NULL ORDER BY id;

-- name: SoftDeletePinCategory :exec
UPDATE pins_category SET
    deleted_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: SoftDeletePin :exec
UPDATE pins SET
    deleted_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: SoftDeleteEmployeePin :exec
UPDATE employee_pins SET
    deleted_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE category_id = $1;


