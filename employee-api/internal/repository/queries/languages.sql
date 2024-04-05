-- name: GetLanguageByName :one
SELECT *
FROM languages
WHERE name = $1 LIMIT 1;

-- name: CreateLanguage :one
INSERT INTO languages (
    name
) VALUES (
    $1
)
RETURNING *;