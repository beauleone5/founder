# Founder Radar - Makefile for common tasks

.PHONY: help install build start dev migrate verify clean test

help:
	@echo "Founder Radar - Available Commands"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  make install      - Install dependencies"
	@echo "  make build        - Build TypeScript project"
	@echo "  make start        - Start production server"
	@echo "  make dev          - Start development server"
	@echo "  make migrate      - Run database migrations"
	@echo "  make verify       - Verify setup"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make report       - Generate weekly report"
	@echo "  make setup        - Complete first-time setup"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

install:
	@echo "Installing dependencies..."
	npm install

build:
	@echo "Building TypeScript..."
	npm run build

start: build
	@echo "Starting production server..."
	npm start

dev:
	@echo "Starting development server..."
	npm run dev

migrate:
	@echo "Running database migrations..."
	npm run migrate

verify:
	@echo "Verifying setup..."
	@./scripts/verify-setup.sh

clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist/
	rm -rf node_modules/
	@echo "Clean complete. Run 'make install' to reinstall."

report:
	@echo "Generating weekly report..."
	npm run weekly-report

setup: install
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "First-time setup for Founder Radar"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@if [ ! -f .env ]; then \
		echo "Creating .env file..."; \
		cp .env.example .env; \
		echo "✓ .env created from .env.example"; \
		echo "⚠ Please edit .env and add your ANTHROPIC_API_KEY"; \
	else \
		echo "✓ .env already exists"; \
	fi
	@echo ""
	@make build
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Setup complete!"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "Next steps:"
	@echo "  1. Edit .env and add your ANTHROPIC_API_KEY"
	@echo "  2. Create database: createdb founder_radar"
	@echo "  3. Run migrations: make migrate"
	@echo "  4. Start server: make start"
	@echo ""
	@echo "For verification, run: make verify"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
