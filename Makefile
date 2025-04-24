.PHONY: help build dev

define banner
	@echo "\n\033[1;37m=============================================="
	@echo "  $(1)"
	@echo "==============================================\033[0m\n"
endef

help:
	$(call banner,"Available commands:")
	@echo "  make help    - Show this help message"
	@echo "  make build   - Build mobile, desktop and storybook"
	@echo "  make dev     - Run development servers (kills existing ones first)"

build:
	$(call banner,"BUILDING MOBILE")
	npm run build:mobile
	$(call banner,"BUILDING DESKTOP")
	npm run build:desktop
	$(call banner,"BUILDING STORYBOOK")
	npm run build-storybook
	$(call banner,"BUILD COMPLETE")

dev:
	$(call banner,"STARTING DEV SERVERS VIA SCRIPT")
	@echo "Executing scripts/make-dev.sh..."
	@echo "Use Ctrl+C to stop all servers."
	@./scripts/make-dev.sh
