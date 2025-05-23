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
	@read -p "Enter environment (production/acceptance/test): " input_env; \
	SELECTED_ENV=""; \
	case "$$input_env" in \
		production|acceptance|test) \
			SELECTED_ENV="$$input_env"; \
			;; \
		*) \
			echo "Error: Environment must be one of: production, acceptance, test"; \
			exit 1; \
			;; \
	esac; \
	@echo "INFO: Selected environment for build: [$$SELECTED_ENV]"; \
	$(call banner,"BUILDING MOBILE for $$SELECTED_ENV")
	@echo "INFO: Makefile is setting BUILD_ENV=$$SELECTED_ENV for the mobile build."
	@echo "INFO: Vite config should use this for output: dist/$$SELECTED_ENV/mobile"
	bash scripts/bump.sh --release
	BUILD_ENV="$$SELECTED_ENV" npm run build:mobile
	bash scripts/bump.sh --release-candidate
	$(call banner,"BUILDING DESKTOP for $$SELECTED_ENV")
	@echo "INFO: Makefile is setting BUILD_ENV=$$SELECTED_ENV for the desktop build."
	@echo "INFO: Vite config should use this for output: dist/$$SELECTED_ENV/desktop"
	BUILD_ENV="$$SELECTED_ENV" npm run build:desktop
	$(call banner,"BUILDING STORYBOOK for $$SELECTED_ENV")
	@echo "INFO: Makefile is setting BUILD_ENV=$$SELECTED_ENV for the Storybook build."
	@echo "INFO: Storybook output is typically 'storybook-static' and may not be affected by BUILD_ENV unless configured in .storybook/main.js."
	BUILD_ENV="$$SELECTED_ENV" npm run build-storybook
	$(call banner,"BUILD COMPLETE for $$SELECTED_ENV")

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
