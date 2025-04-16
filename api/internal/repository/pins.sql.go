// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.28.0
// source: pins.sql

package repository

import (
	"context"
)

const createPinCategory = `-- name: CreatePinCategory :one
INSERT INTO pins_category (
    name,
    created_at,
    updated_at
) VALUES (
    $1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
RETURNING id, name, deleted_at, created_at, updated_at
`

func (q *Queries) CreatePinCategory(ctx context.Context, name string) (PinsCategory, error) {
	row := q.db.QueryRow(ctx, createPinCategory, name)
	var i PinsCategory
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.DeletedAt,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getPinCategories = `-- name: GetPinCategories :many
SELECT id, name, deleted_at, created_at, updated_at FROM pins_category WHERE deleted_at IS NULL ORDER BY id
`

func (q *Queries) GetPinCategories(ctx context.Context) ([]PinsCategory, error) {
	rows, err := q.db.Query(ctx, getPinCategories)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []PinsCategory
	for rows.Next() {
		var i PinsCategory
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.DeletedAt,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const softDeleteEmployeePin = `-- name: SoftDeleteEmployeePin :exec
UPDATE employee_pins SET
    deleted_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE category_id = $1
`

func (q *Queries) SoftDeleteEmployeePin(ctx context.Context, categoryID int32) error {
	_, err := q.db.Exec(ctx, softDeleteEmployeePin, categoryID)
	return err
}

const softDeletePin = `-- name: SoftDeletePin :exec
UPDATE pins SET
    deleted_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
`

func (q *Queries) SoftDeletePin(ctx context.Context, id int32) error {
	_, err := q.db.Exec(ctx, softDeletePin, id)
	return err
}

const softDeletePinCategory = `-- name: SoftDeletePinCategory :exec
UPDATE pins_category SET
    deleted_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
`

func (q *Queries) SoftDeletePinCategory(ctx context.Context, id int32) error {
	_, err := q.db.Exec(ctx, softDeletePinCategory, id)
	return err
}
