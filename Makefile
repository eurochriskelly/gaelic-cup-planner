SHELL := bash
.ONESHELL:

ENV := $(firstword $(filter production acceptance test,$(MAKECMDGOALS)))

.PHONY: help build production acceptance test dev-mobile dev-desktop story home

production:
acceptance:
test:

define banner
	printf "\n\033[1;37m== %s ==\033[0m\n" "$(1)"
endef

help:
	$(call banner,Commands)
	@echo "make build [production|acceptance|test]   Build all targets"
	@echo "make dev-mobile                          Start mobile dev server"
	@echo "make dev-desktop                         Start desktop dev server"
	@echo "make story                               Run Storybook"
	@echo "make home                                Serve home interface"

build:
	@if [ -z "$(ENV)" ]; then \
	  echo "Usage: make build [production|acceptance|test]"; \
	  exit 1; \
	fi
	@if [ "$(ENV)" = "production" ]; then \
	  bash scripts/bump.sh --release; \
	elif [ "$(ENV)" = "acceptance" ]; then \
	  bash scripts/bump.sh --release-candidate; \
	fi
	$(call banner,Building $(ENV))
	@BUILD_ENV=$(ENV) npm run build:mobile
	@if [ "$(ENV)" = "production" ]; then \
	  bash scripts/bump.sh --release-candidate; \
	fi
	$(call banner,Building desktop $(ENV))
	@BUILD_ENV=$(ENV) npm run build:desktop
	$(call banner,Building storybook $(ENV))
	@BUILD_ENV=$(ENV) npm run build-storybook
	$(call banner,Done $(ENV))

dev-mobile:
	$(call banner,Dev mobile)
	@npm run dev:mobile

dev-desktop:
	$(call banner,Dev desktop)
	@npm run dev:desktop

story:
	$(call banner,Storybook)
	@npm run storybook

home:
	@httpster -p 5175 -d src/interfaces/home
