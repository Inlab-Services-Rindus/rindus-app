package model

import "testing"

func TestParsePersonioPartnerID(t *testing.T) {
	tests := []struct {
		name    string
		arg     string
		want    string
		wantErr bool
	}{
		{"Should parse IT prefixed departments", "IT Douglas", "Douglas", false},
		{"Should not parse IT prefixed departments without spaces", "ITDouglas", "", true},
		{"Should parse 'People and Culture'", "People and Culture", "rindus", false},
		{"Should parse 'Management'", "Management", "rindus", false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ParsePersonioPartnerID(tt.arg)
			if (err != nil) != tt.wantErr {
				t.Errorf("ParsePersonioPartnerID() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("ParsePersonioPartnerID() = %v, want %v", got, tt.want)
			}
		})
	}
}
