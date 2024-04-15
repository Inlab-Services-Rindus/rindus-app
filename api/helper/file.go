package helper

import "os"

func ReadJSONFile[T any](filename string) (*T, error) {
	file, err := os.Open(filename)

	if err != nil {
		return nil, err
	}
	defer file.Close()

	result, err := JSONDecode[T](file)
	if err != nil {
		return nil, err
	}

	return result, nil
}
