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

-- name: CreatePin :one
INSERT INTO pins (
    event_date,
    image_pin,
    pin_title,
    pin_description,
    auto_assigned,
    category_id,
    created_at,
    updated_at
) VALUES (
    $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
RETURNING *;

-- name: GetPinByID :one
SELECT * FROM pins WHERE id = $1 AND deleted_at IS NULL;

-- name: GetPins :many
SELECT * FROM pins WHERE deleted_at IS NULL ORDER BY id;

-- name: UpdatePin :one
UPDATE pins
SET
    event_date = COALESCE(sqlc.narg('event_date'), event_date),
    image_pin = COALESCE(sqlc.narg('image_pin'), image_pin),
    pin_title = COALESCE(sqlc.narg('pin_title'), pin_title),
    pin_description = COALESCE(sqlc.narg('pin_description'), pin_description),
    auto_assigned = COALESCE(sqlc.narg('auto_assigned'), auto_assigned),
    category_id = COALESCE(sqlc.narg('category_id'), category_id),
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND deleted_at IS NULL
RETURNING *; 

-- name: SoftDeletePin :one
UPDATE pins SET
    deleted_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND deleted_at IS NULL
RETURNING *; 

-- name: SoftDeleteEmployeePin :exec
UPDATE employee_pins SET
    deleted_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE category_id = $1;


