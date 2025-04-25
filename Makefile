.PHONY: help build dev

define banner
	@echo "\n\033[1;37m=============================================="
	@echo "  $(1)"
	@echo "==============================================\033[0m\n"
endef

help:
	$(call banner,"Available commands:")
	@echo "  make help           - Show this help message"
	@echo "  make build          - Build mobile, desktop and storybook"
	@echo "  make dev-mobile     - Run development servers (kills existing ones first)"
	@echo "  make dev-desktop    - Run development servers for desktop"
	@echo "  make story          - Run storybook"

build:
	$(call banner,"BUILDING MOBILE")
	npm run build:mobile
	$(call banner,"BUILDING DESKTOP")
	npm run build:desktop
	$(call banner,"BUILDING STORYBOOK")
	npm run build-storybook
	$(call banner,"BUILD COMPLETE")

dev-mobile:
	$(call banner,"STARTING DEV SERVER: mobile")
	@echo "Mobile server on port 5173"
	@npm run dev:mobile

dev-desktop:
	$(call banner,"STARTING DEV SERVER: mobile")
	@echo "Mobile server on port 5173"
	@npm run dev:mobile

story:
	$(call banner,"STARTING DEV SERVER: mobile")
	@echo "Mobile server on port 5173"
	@npm run storybook
