// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0
// source: slack_info.sql

package repository

import (
	"context"
)

const createSlackInfo = `-- name: CreateSlackInfo :one
INSERT INTO slack_info (
    employee_id, name, slack_id
) VALUES (
    $1, $2, $3
)
RETURNING id, name, slack_id, employee_id, created_at, updated_at
`

type CreateSlackInfoParams struct {
	EmployeeID int32
	Name       string
	SlackID    string
}

func (q *Queries) CreateSlackInfo(ctx context.Context, arg CreateSlackInfoParams) (SlackInfo, error) {
	row := q.db.QueryRow(ctx, createSlackInfo, arg.EmployeeID, arg.Name, arg.SlackID)
	var i SlackInfo
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.SlackID,
		&i.EmployeeID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}