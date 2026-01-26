package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/J0kerul/jokers-hub/internal/config"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPostgres() (*pgxpool.Pool, error) {
	ctx := context.Background()
	cfg, err := config.NewConfig()
	if err != nil {
		return nil, err
	}

	pgxstring := "postgres://" + cfg.DatabaseUser + ":" + cfg.DatabasePassword + "@" + cfg.DatabaseHost + ":" + cfg.DatabasePort + "/" + cfg.DatabaseName

	maxRetries := 10
	retryDelay := 2 * time.Second

	var pool *pgxpool.Pool

	for i := 0; i < maxRetries; i++ {
		pool, err = pgxpool.New(ctx, pgxstring)
		if err != nil {
			log.Printf("Failed to create connection pool (attempt %d/%d): %v", i+1, maxRetries, err)
			time.Sleep(retryDelay)
			continue
		}

		// Try to ping
		err = pool.Ping(ctx)
		if err == nil {
			log.Println("Successfully connected to database!")
			return pool, nil
		}

		log.Printf("Failed to ping database (attempt %d/%d): %v", i+1, maxRetries, err)
		pool.Close()
		time.Sleep(retryDelay)
	}

	return nil, fmt.Errorf("failed to connect to database after %d attempts: %w", maxRetries, err)
}
