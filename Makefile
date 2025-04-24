.PHONY: help build dev

help:
	@echo "Available commands:"
	@echo "  make help    - Show this help message"
	@echo "  make build   - Build mobile, desktop and storybook"
	@echo "  make dev     - Run development servers (kills existing ones first)"

build:
	npm run build:mobile
	npm run build:desktop
	npm run build-storybook

dev:
	@pkill -f "vite --config vite.config-desktop.js" || true
	@pkill -f "vite --config vite.config-mobile.js" || true
	@pkill -f "storybook dev" || true
	npm run dev:desktop &
	npm run dev:mobile &
	npm run storybook &
