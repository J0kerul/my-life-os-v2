package database

import (
	"context"

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

	pool, err := pgxpool.New(ctx, pgxstring)
	if err != nil {
		return nil, err
	}
	return pool, nil
}
