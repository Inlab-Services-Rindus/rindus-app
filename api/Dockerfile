FROM golang:1.22

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . ./

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags '-s -w' -o /api cmd/server/main.go

EXPOSE 8080

CMD ["/api"]