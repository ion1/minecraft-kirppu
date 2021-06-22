# Dockerfile is generated from Dockerfile.liquid

FROM openjdk:16 AS minecraft-base
RUN \
  groupadd -g 1000 minecraft && \
  useradd -u 1000 -g minecraft -s /bin/sh minecraft && \
  mkdir -p /minecraft/server /minecraft/mods && \
  chown -R minecraft:minecraft /minecraft

FROM minecraft-base AS minecraft-download
RUN microdnf install wget && microdnf clean all
COPY download-mod /

FROM minecraft-download AS minecraft-server
USER minecraft
WORKDIR /minecraft/server
RUN wget -nc -O ../fabric-installer.jar 'https://maven.fabricmc.net/net/fabricmc/fabric-installer/0.7.4/fabric-installer-0.7.4.jar'
RUN \
  java -jar ../fabric-installer.jar server \
  -mcversion '1.17' \
  -loaderversion '0.11.6' \
  -downloadMinecraft

FROM minecraft-download AS minecraft-mod-306612
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'fabric-api-0.36.0+1.17.jar' 'https://edge-service.overwolf.wtf/files/3358/619/fabric-api-0.36.0+1.17.jar' 'https://edge.forgecdn.net/files/3358/619/fabric-api-0.36.0+1.17.jar'

FROM minecraft-download AS minecraft-mod-360438
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'lithium-fabric-mc1.17-0.7.2.jar' 'https://edge-service.overwolf.wtf/files/3359/899/lithium-fabric-mc1.17-0.7.2.jar' 'https://edge.forgecdn.net/files/3359/899/lithium-fabric-mc1.17-0.7.2.jar'

FROM minecraft-download AS minecraft-mod-433518
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'lazydfu-0.1.2.jar' 'https://edge-service.overwolf.wtf/files/3209/972/lazydfu-0.1.2.jar' 'https://edge.forgecdn.net/files/3209/972/lazydfu-0.1.2.jar'

FROM minecraft-download AS minecraft-mod-415758
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'smoothboot-fabric-1.16.5-1.6.0.jar' 'https://edge-service.overwolf.wtf/files/3248/104/smoothboot-fabric-1.16.5-1.6.0.jar' 'https://edge.forgecdn.net/files/3248/104/smoothboot-fabric-1.16.5-1.6.0.jar'

FROM minecraft-download AS minecraft-mod-325471
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'InventorySorter-1.7.9-1.17.jar' 'https://edge-service.overwolf.wtf/files/3351/25/InventorySorter-1.7.9-1.17.jar' 'https://edge.forgecdn.net/files/3351/25/InventorySorter-1.7.9-1.17.jar'

FROM minecraft-download AS minecraft-mod-225179
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'fabricmod_VoxelMap-1.10.15_for_1.17.0.jar' 'https://edge-service.overwolf.wtf/files/3345/206/fabricmod_VoxelMap-1.10.15_for_1.17.0.jar' 'https://edge.forgecdn.net/files/3345/206/fabricmod_VoxelMap-1.10.15_for_1.17.0.jar'

FROM itzg/rcon-cli AS rcon-cli

FROM minecraft-base
VOLUME /data
RUN \
  mkdir -p /data && \
  chown -R minecraft:minecraft /data
USER minecraft
WORKDIR /data

COPY --from=minecraft-server /minecraft/server/*.jar /minecraft/server/
COPY --from=minecraft-mod-306612 /minecraft/mods/'fabric-api-0.36.0+1.17.jar' /minecraft/mods/
COPY --from=minecraft-mod-360438 /minecraft/mods/'lithium-fabric-mc1.17-0.7.2.jar' /minecraft/mods/
COPY --from=minecraft-mod-433518 /minecraft/mods/'lazydfu-0.1.2.jar' /minecraft/mods/
COPY --from=minecraft-mod-415758 /minecraft/mods/'smoothboot-fabric-1.16.5-1.6.0.jar' /minecraft/mods/
COPY --from=minecraft-mod-325471 /minecraft/mods/'InventorySorter-1.7.9-1.17.jar' /minecraft/mods/
COPY --from=minecraft-mod-225179 /minecraft/mods/'fabricmod_VoxelMap-1.10.15_for_1.17.0.jar' /minecraft/mods/
COPY --from=rcon-cli /rcon-cli /
COPY rcon /
COPY log4j2.xml /minecraft/
COPY start health-check /
EXPOSE 25565
ENTRYPOINT ["/start"]
HEALTHCHECK --start-period=1m CMD ["/health-check"]
