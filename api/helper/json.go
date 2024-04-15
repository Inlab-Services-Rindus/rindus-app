package helper

import (
	"encoding/json"
	"io"
)

func JSONDecode[T any](r io.Reader) (*T, error) {
	var result *T
	if err := json.NewDecoder(r).Decode(&result); err != nil {
		return nil, err
	}

	return result, nil
}

func JSONEncode(w io.Writer, v any) error {
	if err := json.NewEncoder(w).Encode(v); err != nil {
		return err
	}

	return nil
}
