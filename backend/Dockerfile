FROM golang:1.25.5-alpine

WORKDIR /app

# Install Air for hot reload
RUN go install github.com/air-verse/air@latest

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy .air.toml config
COPY .air.toml .

# Copy source code (wird durch volumes überschrieben aber gut für build)
COPY . .

# Expose port
EXPOSE 8080

# Run air
CMD ["air", "-c", ".air.toml"]