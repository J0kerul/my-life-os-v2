package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseHost     string
	DatabasePort     string
	DatabaseUser     string
	DatabasePassword string
	DatabaseName     string
}

func NewConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, fmt.Errorf("error loading .env file: %v", err)
	}

	dbhost := os.Getenv("DB_HOST")
	if dbhost == "" {
		err = fmt.Errorf("DB_HOST is missing")
		return nil, err
	}

	dbport := os.Getenv("DB_PORT")
	if dbport == "" {
		err = fmt.Errorf("DB_PORT is missing")
		return nil, err
	}

	dbuser := os.Getenv("DB_USER")
	if dbuser == "" {
		err = fmt.Errorf("DB_USER is missing")
		return nil, err
	}

	dbpassword := os.Getenv("DB_PASSWORD")
	if dbpassword == "" {
		err = fmt.Errorf("DB_PASSWORD is missing")
		return nil, err
	}

	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		err = fmt.Errorf("DB_NAME is missing")
		return nil, err
	}

	config := &Config{
		DatabaseHost:     dbhost,
		DatabasePort:     dbport,
		DatabaseUser:     dbuser,
		DatabasePassword: dbpassword,
		DatabaseName:     dbname,
	}
	return config, nil
}
