package personioapi

import (
	"context"
)

type Seeder interface {
	Seed(context.Context) error
}

type seeder struct {
	personioService *personioService
	apiImporter     *personioApiImporter
}

// Seed implements Seeder.
func (s *seeder) Seed(ctx context.Context) error {
	employees, err := s.personioService.CompanyEmployees()
	if err != nil {
		return err
	}

	if err := s.apiImporter.ImportEmployees(ctx, employees); err != nil {
		return err
	}

	if err := s.apiImporter.UpdateEmployees(ctx, employees); err != nil {
		return err
	}

	return nil
}

func NewSeeder(service *personioService, apiImporter *personioApiImporter) Seeder {
	return &seeder{service, apiImporter}
}
