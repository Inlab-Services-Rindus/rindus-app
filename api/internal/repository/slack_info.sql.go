// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.28.0
// source: slack_info.sql

package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const createSlackInfo = `-- name: CreateSlackInfo :one
INSERT INTO slack_info (
    employee_id, name, slack_id,    avatar_url
) VALUES (
    $1, $2, $3, $4
)
RETURNING id, name, slack_id, employee_id, created_at, updated_at, avatar_url
`

type CreateSlackInfoParams struct {
	EmployeeID int32
	Name       string
	SlackID    string
	AvatarUrl  pgtype.Text
}

func (q *Queries) CreateSlackInfo(ctx context.Context, arg CreateSlackInfoParams) (SlackInfo, error) {
	row := q.db.QueryRow(ctx, createSlackInfo,
		arg.EmployeeID,
		arg.Name,
		arg.SlackID,
		arg.AvatarUrl,
	)
	var i SlackInfo
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.SlackID,
		&i.EmployeeID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.AvatarUrl,
	)
	return i, err
}

const updateSlackInfo = `-- name: UpdateSlackInfo :exec
UPDATE slack_info SET 
    name = $2, slack_id = $3, avatar_url = $4
WHERE employee_id = $1
`

type UpdateSlackInfoParams struct {
	EmployeeID int32
	Name       string
	SlackID    string
	AvatarUrl  pgtype.Text
}

func (q *Queries) UpdateSlackInfo(ctx context.Context, arg UpdateSlackInfoParams) error {
	_, err := q.db.Exec(ctx, updateSlackInfo,
		arg.EmployeeID,
		arg.Name,
		arg.SlackID,
		arg.AvatarUrl,
	)
	return err
}
