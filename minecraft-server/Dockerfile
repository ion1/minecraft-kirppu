# Dockerfile is generated from Dockerfile.liquid

FROM openjdk:16-alpine AS minecraft-files

RUN \
  set -eu; \
  apk update; \
  apk add --no-cache wget; \
  addgroup -g 1000 minecraft; \
  adduser -u 1000 -G minecraft -s /bin/sh -D -g '' minecraft; \
  mkdir -p /minecraft/server /minecraft/mods; \
  chown -R minecraft:minecraft /minecraft
USER minecraft
WORKDIR /minecraft/server
RUN wget -nc -O ../fabric-installer.jar 'https://maven.fabricmc.net/net/fabricmc/fabric-installer/0.6.1.51/fabric-installer-0.6.1.51.jar'
RUN \
  java -jar ../fabric-installer.jar server \
  -mcversion '1.16.3' \
  -loaderversion '0.10.8' \
  -downloadMinecraft

WORKDIR /minecraft/mods
RUN wget -nc -O 'fabric-api-0.25.0+build.415-1.16.jar' 'https://edge-service.overwolf.wtf/files/3097/415/fabric-api-0.25.0+build.415-1.16.jar'
RUN wget -nc -O 'InventorySorter-1.7.4-1.16.jar' 'https://edge-service.overwolf.wtf/files/3071/870/InventorySorter-1.7.4-1.16.jar'
RUN wget -nc -O 'Xaeros_Minimap_20.28.1_Fabric_1.16.4.jar' 'https://edge-service.overwolf.wtf/files/3126/290/Xaeros_Minimap_20.28.1_Fabric_1.16.4.jar'
RUN wget -nc -O 'XaerosWorldMap_1.11.3_Fabric_1.16.4.jar' 'https://edge-service.overwolf.wtf/files/3126/304/XaerosWorldMap_1.11.3_Fabric_1.16.4.jar'

FROM itzg/rcon-cli AS rcon-cli

FROM openjdk:16-alpine

VOLUME /data

RUN \
  set -eu; \
  addgroup -g 1000 minecraft; \
  adduser -u 1000 -G minecraft -s /bin/sh -D -g '' minecraft; \
  mkdir -p /minecraft/server /minecraft/mods /data; \
  chown -R minecraft:minecraft /minecraft /data
USER minecraft
WORKDIR /data

COPY --from=minecraft-files /minecraft/server/*.jar /minecraft/server/
COPY --from=minecraft-files /minecraft/mods/*.jar /minecraft/mods/

COPY --from=rcon-cli /rcon-cli /

COPY log4j2.xml /minecraft/
COPY start health-check /

EXPOSE 25565

ENTRYPOINT ["/start"]
HEALTHCHECK --start-period=1m CMD ["/health-check"]
