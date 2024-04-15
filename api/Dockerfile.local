FROM golang:1.22

WORKDIR /usr/app

RUN go install github.com/cosmtrek/air@latest

COPY go.mod go.sum ./
RUN go mod download && go mod verify

CMD ["air", "-c", ".air.toml"]