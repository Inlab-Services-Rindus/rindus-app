// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.28.0
// source: languages.sql

package repository

import (
	"context"
)

const createLanguage = `-- name: CreateLanguage :one
INSERT INTO languages (
    name
) VALUES (
    $1
)
RETURNING id, name, created_at, updated_at
`

func (q *Queries) CreateLanguage(ctx context.Context, name string) (Language, error) {
	row := q.db.QueryRow(ctx, createLanguage, name)
	var i Language
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getLanguageByName = `-- name: GetLanguageByName :one
SELECT id, name, created_at, updated_at
FROM languages
WHERE name = $1 LIMIT 1
`

func (q *Queries) GetLanguageByName(ctx context.Context, name string) (Language, error) {
	row := q.db.QueryRow(ctx, getLanguageByName, name)
	var i Language
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
