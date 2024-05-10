-- name: CreateSlackInfo :one
INSERT INTO slack_info (
    employee_id, name, slack_id,    avatar_url
) VALUES (
    $1, $2, $3, $4
)
RETURNING *;