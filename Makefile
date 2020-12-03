DATA := /srv/minecraft-kirppu

.PHONY: all
all: docker-build

minecraft-server/Dockerfile: minecraft-server/Dockerfile.liquid
	$(MAKE) generate-dockerfile

.PHONY: generate-dockerfile
generate-dockerfile: minecraft-server/Dockerfile.liquid
	cd generate-dockerfile && npm run build && bin/generate-dockerfile ../minecraft-server

.PHONY: docker-build
docker-build: minecraft-server/Dockerfile
	docker build --tag minecraft-kirppu:local minecraft-server

.PHONY: docker-run
docker-run:
	docker run \
	  --detach --restart unless-stopped \
	  --memory 1300m --memory-swap 1300m \
	  --name minecraft-kirppu \
	  --publish 25565:25565 \
	  -v '${DATA}':/data \
	  minecraft-kirppu:local

.PHONY: docker-run-interactive
docker-run-interactive:
	docker run \
	  -it --rm \
	  --memory 1300m --memory-swap 1300m \
	  --name minecraft-kirppu \
	  --publish 25565:25565 \
	  -v '${DATA}':/data \
	  minecraft-kirppu:local

.PHONY: docker-stop
docker-stop:
	docker stop minecraft-kirppu

.PHONY: docker-rm
docker-rm:
	docker rm minecraft-kirppu

.PHONY: rcon
rcon:
	docker exec -it minecraft-kirppu /rcon
