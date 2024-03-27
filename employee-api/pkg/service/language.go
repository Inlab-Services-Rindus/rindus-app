package service

import (
	"context"
	"employee-api/pkg/repository"
)

type LanguageService interface {
	List(ctx context.Context) ([]repository.ListLanguagesRow, error)
}

type languageService struct {
	q *repository.Queries
}

func NewLanguageService(q *repository.Queries) LanguageService {
	return &languageService{q}
}

func (l *languageService) List(ctx context.Context) ([]repository.ListLanguagesRow, error) {
	languages, err := l.q.ListLanguages(ctx)

	if err != nil {
		return nil, err
	}

	return languages, err
}
