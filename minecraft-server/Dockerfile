# Dockerfile is generated from Dockerfile.liquid

FROM openjdk:16-alpine AS minecraft-base
RUN \
  addgroup -g 1000 minecraft && \
  adduser -u 1000 -G minecraft -s /bin/sh -D -g '' minecraft && \
  mkdir -p /minecraft/server /minecraft/mods && \
  chown -R minecraft:minecraft /minecraft

FROM minecraft-base AS minecraft-download
RUN \
  apk update && \
  apk add --no-cache bash wget
COPY download-mod /

FROM minecraft-download AS minecraft-server
USER minecraft
WORKDIR /minecraft/server
RUN wget -nc -O ../fabric-installer.jar 'https://maven.fabricmc.net/net/fabricmc/fabric-installer/0.6.1.51/fabric-installer-0.6.1.51.jar'
RUN \
  java -jar ../fabric-installer.jar server \
  -mcversion '1.16.4' \
  -loaderversion '0.10.8' \
  -downloadMinecraft

FROM minecraft-download AS minecraft-mod-306612
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'fabric-api-0.28.1+1.16.jar' 'https://edge-service.overwolf.wtf/files/3136/798/fabric-api-0.28.1+1.16.jar' 'https://edge.forgecdn.net/files/3136/798/fabric-api-0.28.1+1.16.jar'
FROM minecraft-download AS minecraft-mod-372124
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'phosphor-fabric-mc1.16.1-0.6.0+build.7.jar' 'https://edge-service.overwolf.wtf/files/2987/621/phosphor-fabric-mc1.16.1-0.6.0+build.7.jar' 'https://edge.forgecdn.net/files/2987/621/phosphor-fabric-mc1.16.1-0.6.0+build.7.jar'
FROM minecraft-download AS minecraft-mod-360438
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'lithium-fabric-mc1.16.4-0.6.0.jar' 'https://edge-service.overwolf.wtf/files/3107/909/lithium-fabric-mc1.16.4-0.6.0.jar' 'https://edge.forgecdn.net/files/3107/909/lithium-fabric-mc1.16.4-0.6.0.jar'
FROM minecraft-download AS minecraft-mod-325471
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'InventorySorter-1.7.4-1.16.jar' 'https://edge-service.overwolf.wtf/files/3071/870/InventorySorter-1.7.4-1.16.jar' 'https://edge.forgecdn.net/files/3071/870/InventorySorter-1.7.4-1.16.jar'
FROM minecraft-download AS minecraft-mod-263420
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'Xaeros_Minimap_20.28.2_Fabric_1.16.4.jar' 'https://edge-service.overwolf.wtf/files/3132/575/Xaeros_Minimap_20.28.2_Fabric_1.16.4.jar' 'https://edge.forgecdn.net/files/3132/575/Xaeros_Minimap_20.28.2_Fabric_1.16.4.jar'
FROM minecraft-download AS minecraft-mod-317780
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'XaerosWorldMap_1.11.4_Fabric_1.16.4.jar' 'https://edge-service.overwolf.wtf/files/3132/588/XaerosWorldMap_1.11.4_Fabric_1.16.4.jar' 'https://edge.forgecdn.net/files/3132/588/XaerosWorldMap_1.11.4_Fabric_1.16.4.jar'

FROM itzg/rcon-cli AS rcon-cli

FROM minecraft-base
VOLUME /data
RUN \
  mkdir -p /data && \
  chown -R minecraft:minecraft /data
USER minecraft
WORKDIR /data

COPY --from=minecraft-server /minecraft/server/*.jar /minecraft/server/
COPY --from=minecraft-mod-306612 /minecraft/mods/'fabric-api-0.28.1+1.16.jar' /minecraft/mods/
COPY --from=minecraft-mod-372124 /minecraft/mods/'phosphor-fabric-mc1.16.1-0.6.0+build.7.jar' /minecraft/mods/
COPY --from=minecraft-mod-360438 /minecraft/mods/'lithium-fabric-mc1.16.4-0.6.0.jar' /minecraft/mods/
COPY --from=minecraft-mod-325471 /minecraft/mods/'InventorySorter-1.7.4-1.16.jar' /minecraft/mods/
COPY --from=minecraft-mod-263420 /minecraft/mods/'Xaeros_Minimap_20.28.2_Fabric_1.16.4.jar' /minecraft/mods/
COPY --from=minecraft-mod-317780 /minecraft/mods/'XaerosWorldMap_1.11.4_Fabric_1.16.4.jar' /minecraft/mods/
COPY --from=rcon-cli /rcon-cli /
COPY rcon /
COPY log4j2.xml /minecraft/
COPY start health-check /
EXPOSE 25565
ENTRYPOINT ["/start"]
HEALTHCHECK --start-period=1m CMD ["/health-check"]
