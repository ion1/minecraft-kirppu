DATA := /srv/minecraft-kirppu

.PHONY: all
all: docker-build

minecraft-server/Dockerfile: minecraft-server/Dockerfile.liquid
	$(MAKE) generate-dockerfile

.PHONY: generate-dockerfile
generate-dockerfile: minecraft-server/Dockerfile.liquid
	docker build --tag minecraft-kirppu-generate-dockerfile:local generate-dockerfile
	docker scan --accept-license minecraft-kirppu-generate-dockerfile:local
	docker run -i --rm minecraft-kirppu-generate-dockerfile:local \
	  <minecraft-server/Dockerfile.liquid \
	  >minecraft-server/Dockerfile

.PHONY: docker-build
docker-build: minecraft-server/Dockerfile
	docker build --tag minecraft-kirppu:local minecraft-server
	docker scan --accept-license minecraft-kirppu:local

# TODO: Run a Docker registry
.PHONY: docker-upload
docker-upload:
	test -n "$$SSH_SERVER"
	ssh-agent bash -eu -o pipefail -c \
	  'ssh-add; docker save minecraft-kirppu:local | gzip | pv | ssh "$$SSH_SERVER" docker load'

.PHONY: docker-run
docker-run:
	docker run \
	  --detach --restart unless-stopped \
	  --memory 1400m --memory-swap 1400m \
	  --name minecraft-kirppu \
	  --publish 25565:25565 \
	  -v '${DATA}':/data \
	  minecraft-kirppu:local

.PHONY: docker-run-interactive
docker-run-interactive:
	docker run \
	  -it --rm \
	  --memory 1400m --memory-swap 1400m \
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
