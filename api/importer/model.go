package importer

type SlackMembers struct {
	Members []SlackMember `json:"members,omitempty"`
}

type SlackMember struct {
	Id      string       `json:"id,omitempty"`
	Name    string       `json:"name,omitempty"`
	Profile SlackProfile `json:"profile,omitempty"`
}

type SlackProfile struct {
	Email    *string `json:"email,omitempty"`
	Image192 *string `json:"image_192,omitempty"`
}
