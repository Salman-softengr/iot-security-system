.PHONY: up down build train test logs clean

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build

train:
	docker-compose run --rm inference python model/train.py

test:
	docker-compose run --rm orchestrator pytest tests/unit
	docker-compose run --rm orchestrator pytest tests/integration

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	rm -rf inference/model/saved/*
