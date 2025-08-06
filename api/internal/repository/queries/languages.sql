-- name: GetLanguageByName :one
SELECT *
FROM languages
WHERE name = $1 LIMIT 1;

-- name: CreateLanguage :one
INSERT INTO languages (
    name,
    created_at,
    updated_at
) VALUES (
    $1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
RETURNING *;