.PHONY: help build dev

define banner
	printf "\n\033[1;37m==============================================\n"
	printf "  $(1)\n" 
	printf "==============================================\033[0m\n\n"
endef

help:
	$(call banner,"Available commands:")
	@echo "  make help           - Show this help message"
	@echo "  make build          - Build mobile, desktop and storybook"
	@echo "  make dev-mobile     - Run development servers (kills existing ones first)"
	@echo "  make dev-desktop    - Run development servers for desktop"
	@echo "  make story          - Run storybook"

build:
	@read -p "Enter environment (production/acceptance/test): " env; \
	case "$$env" in \
		production|acceptance|test) \
			;; \
		*) \
			echo "Error: Environment must be one of: production, acceptance, test"; \
			exit 1; \
			;; \
	esac; \
	$(call banner,"BUILDING MOBILE for $$env")
	bash scripts/bump.sh --release
	ENV=$$env npm run build:mobile
	bash scripts/bump.sh --release-candidate
	$(call banner,"BUILDING DESKTOP for $$env")
	ENV=$$env npm run build:desktop
	$(call banner,"BUILDING STORYBOOK for $$env")
	ENV=$$env npm run build-storybook
	$(call banner,"BUILD COMPLETE for $$env")

dev-mobile:
	$(call banner,"STARTING DEV SERVER: mobile")
	@echo "Mobile server on port 5173"
	@npm run dev:mobile

dev-desktop:
	$(call banner,"STARTING DEV SERVER: mobile")
	@echo "Mobile server on port 5173"
	@npm run dev:mobile

home:
	@httpster -p 5175 -d src/interfaces/home

story:
	$(call banner,"STARTING DEV SERVER: mobile")
	@echo "Mobile server on port 5173"
	@npm run storybook
