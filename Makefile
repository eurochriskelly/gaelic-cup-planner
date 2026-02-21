SHELL := bash
.ONESHELL:

ENV := $(firstword $(filter production acceptance test,$(MAKECMDGOALS)))

.PHONY: help build build-storybook production acceptance test dev-mobile story home

help:
	$(call banner,Commands)
	@echo "make build [production|acceptance|test]    Build mobile target"
	@echo "make build-storybook [production|...]      Build storybook"
	@echo "make dev-mobile                            Start mobile dev server"
	@echo "make story                                 Run Storybook"
	@echo "make home                                  Serve home interface"

production:
acceptance:
test:

define banner
	printf "\n\033[1;37m== %s ==\033[0m\n" "$(1)"
endef

build:
	@if [ -z "$(ENV)" ]; then \
	  echo "Usage: make build [production|acceptance|test]"; \
	  exit 1; \
	fi
	@if [ -z "$(BUMP)" ]; then \
	  echo -e "\033[33mDo you want to bump the version? (y/n): \033[0m"; \
	  echo "To suppress this prompt, use 'make build $(ENV) BUMP=[true|false]'"; \
	  read answer; \
	  if [ "$$answer" = "y" ] || [ "$$answer" = "Y" ]; then \
	    BUMP=true; \
	  else \
	    BUMP=false; \
	  fi; \
	fi
	@if [ "$(BUMP)" = "true" ]; then \
	  if [ "$(ENV)" = "production" ]; then \
	    bash scripts/bump.sh --release; \
	  elif [ "$(ENV)" = "acceptance" ]; then \
	    bash scripts/bump.sh --release-candidate; \
	  fi; \
	fi
	$(call banner,Building $(ENV))
	@BUILD_ENV=$(ENV) npm run build:mobile
	@if [ "$(BUMP)" = "true" ] && [ "$(ENV)" = "production" ]; then \
	  bash scripts/bump.sh --release-candidate; \
	fi
	$(call banner,Done $(ENV))

dev:
	$(call banner,Dev mobile)
	@npm run dev:mobile

build-storybook:
	$(call banner,Building storybook $(ENV))
	@BUILD_ENV=$(ENV) npm run build-storybook

story:
	$(call banner,Storybook)
	@npm run storybook

home:
	@httpster -p 5175 -d src/interfaces/home
