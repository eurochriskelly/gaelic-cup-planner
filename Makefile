.PHONY: help build dev

help:
	@echo "Available commands:"
	@echo "  make help    - Show this help message"
	@echo "  make build   - Build mobile, desktop and storybook"
	@echo "  make dev     - Run development servers (kills existing ones first)"

build:
	@echo "=== BUILDING MOBILE ==="
	npm run build:mobile
	@echo "\n=== BUILDING DESKTOP ==="
	npm run build:desktop
	@echo "\n=== BUILDING STORYBOOK ==="
	npm run build-storybook
	@echo "\n=== BUILD COMPLETE ==="

dev:
	@echo "=== KILLING EXISTING SERVERS ==="
	@pkill -f "vite --config vite.config-desktop.js" || true
	@pkill -f "vite --config vite.config-mobile.js" || true
	@pkill -f "storybook dev" || true
	@echo "\n=== STARTING DESKTOP DEV SERVER ==="
	npm run dev:desktop &
	@echo "\n=== STARTING MOBILE DEV SERVER ==="
	npm run dev:mobile &
	@echo "\n=== STARTING STORYBOOK ==="
	npm run storybook &
	@echo "\n=== DEV SERVERS RUNNING ==="
