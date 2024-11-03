COMPOSE		=	-f ./docker-compose.yml
BLOCK_IMG	=	tran_ganache
BLOCK_CON	=	block_test_env

all: block_up
	docker compose $(COMPOSE) up

build:
	docker-compose $(COMPOSE) up --build

block_up:
	docker build ./ganache -t $(BLOCK_IMG)
	docker run -d --name $(BLOCK_CON) -p 8545:8545 $(BLOCK_IMG)

block_down:
	docker stop $(BLOCK_CON)
	docker rm $(BLOCK_CON)

down:
	docker-compose $(COMPOSE) down

re: down
	docker-compose $(COMPOSE) up --detach --build

clean: down
	docker system prune -a --force

fclean:
	docker compose $(COMPOSE) down -v
	docker system prune --all --force --volumes
	docker stop $(BLOCK_CON)
	docker rm $(BLOCK_CON)
	docker rmi $(BLOCK_IMG)


.PHONY	: all build down re clean fclean block_up block_down
