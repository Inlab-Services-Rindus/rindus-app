-- name: CreateSlackInfo :one
INSERT INTO slack_info (
    employee_id, name, slack_id
) VALUES (
    $1, $2, $3
)
RETURNING *;