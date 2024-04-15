package importer

type SlackMembers struct {
	Members []SlackMember `json:"members,omitempty"`
}

type SlackMember struct {
	Id      string       `json:"id,omitempty"`
	Name    string       `json:"name,omitempty"`
	Profile SlackProfile `json:"profile,omitempty"`
	Deleted bool         `json:"deleted,omitempty"`
}

type SlackProfile struct {
	Email *string `json:"email,omitempty"`
}
