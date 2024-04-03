package model

import (
	"context"
	"fmt"
	"strings"

	"employee-api/pkg"
	"employee-api/pkg/helper"
)

const (
	ITPrefix         = "IT "
	PeopleAndCulture = "People and Culture"
	Management       = "Management"
	Rindus           = "rindus"
)

type Partner struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	LogoUrl     string `json:"logo_url"`
	Description string `json:"description"`
}

var partnerDescriptions = map[string]string{
	"douglas":  "With over 2,000 stores, leader of Europe's beauty care sector.",
	"stroer":   "Germany's leading digital multi-channel media firm, provider of integrated marketing solutions.",
	"sonnen":   "Top German solar battery manufacturer merging renewable energy storage and home automation.",
	"canda":    "Founded in 1841, family-owned C&A provides affordable, ready-to-wear clothing for everyday consumers.",
	"auxmoney": "Auxmoney is the leading FinTech in Germany for online peer-to-peer credits.",
	"obi":      "OBI is the leading do-it-yourself store for building supplies in Germany, Austria.",
	"lps":      "Technology leaders with 15 years of expertise in managing coalition loyalty programs in travel and transportation.",
}

type PartnerService interface {
	List(ctx context.Context) ([]Partner, error)
	Employees(ctx context.Context, partnerID int) ([]Employee, error)
}

func ParsePersonioPartnerID(partnerID string) (string, error) {
	if strings.HasPrefix(partnerID, ITPrefix) {
		return sanitisePersonioITPartner(partnerID), nil
	}

	if isInternal(partnerID) {
		return Rindus, nil
	}

	return "", pkg.Errorf(pkg.CodeErrNotValid, "Personio department ID %q not valid", partnerID)
}

func NewPartner(name string) *Partner {
	key := partnerNameAsMapKey(name)
	return &Partner{
		ID:          0,
		Name:        name,
		LogoUrl:     fmt.Sprintf("/images/partners/%s.jpg", key),
		Description: partnerDescriptions[key],
	}
}

func sanitisePersonioITPartner(partner string) string {
	return helper.TrimSpace(strings.Replace(partner, ITPrefix, "", 1))
}

func partnerNameAsMapKey(partner string) string {
	firstPhase := strings.NewReplacer(" ", "-", "ö", "o", "&", "and", "loyalty-partner-solutions", "lps")
	secondPhase := strings.NewReplacer("loyalty-partner-solutions", "lps")

	return secondPhase.Replace(firstPhase.Replace(helper.SanitiseEnum(partner)))
}

func isInternal(partnerID string) bool {
	partner := strings.ToLower(partnerID)

	isInternal := false
	internalDepartments := []string{PeopleAndCulture, Management}
	for i := 0; !isInternal && i < len(internalDepartments); i++ {
		isInternal = partner == strings.ToLower(internalDepartments[i])
	}

	return isInternal
}
