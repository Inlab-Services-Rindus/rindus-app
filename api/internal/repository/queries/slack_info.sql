-- name: CreateSlackInfo :one
INSERT INTO slack_info (
    employee_id, name, slack_id,    avatar_url
) VALUES (
    $1, $2, $3, $4
)
RETURNING *;

-- name: UpdateSlackInfo :exec
UPDATE slack_info SET 
    name = $2, slack_id = $3, avatar_url = $4
WHERE employee_id = $1;