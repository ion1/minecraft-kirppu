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

FROM minecraft-download AS minecraft-mod-fabric_api
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'fabric-api-0.36.0+1.17.jar' 'https://cdn.modrinth.com/data/P7dR8mSH/versions/0.36.0+1.17/fabric-api-0.36.0+1.17.jar'

FROM minecraft-download AS minecraft-mod-lithium
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'lithium-fabric-mc1.17-0.7.2.jar' 'https://cdn.modrinth.com/data/gvQqBUqZ/versions/mc1.17-0.7.2/lithium-fabric-mc1.17-0.7.2.jar'

FROM minecraft-download AS minecraft-mod-hydrogen
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'hydrogen-fabric-mc1.17-0.3.jar' 'https://cdn.modrinth.com/data/AZomiSrC/versions/mc1.17-v0.3.0/hydrogen-fabric-mc1.17-0.3.jar'

FROM minecraft-download AS minecraft-mod-ferrite_core
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'ferritecore-3.0.0-fabric.jar' 'https://cdn.modrinth.com/data/uXXizFIs/versions/3.0.0/ferritecore-3.0.0-fabric.jar'

FROM minecraft-download AS minecraft-mod-lazydfu
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'lazydfu-0.1.2.jar' 'https://cdn.modrinth.com/data/hvFnDODi/versions/0.1.2/lazydfu-0.1.2.jar'

FROM minecraft-download AS minecraft-mod-smooth_boot
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'smoothboot-fabric-1.16.5-1.6.0.jar' 'https://edge-service.overwolf.wtf/files/3248/104/smoothboot-fabric-1.16.5-1.6.0.jar' 'https://edge.forgecdn.net/files/3248/104/smoothboot-fabric-1.16.5-1.6.0.jar'

FROM minecraft-download AS minecraft-mod-inventory_sorting
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'InventorySorter-1.7.9-1.17.jar' 'https://edge-service.overwolf.wtf/files/3351/25/InventorySorter-1.7.9-1.17.jar' 'https://edge.forgecdn.net/files/3351/25/InventorySorter-1.7.9-1.17.jar'

FROM minecraft-download AS minecraft-mod-voxelmap
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
COPY --from=minecraft-mod-fabric_api /minecraft/mods/'fabric-api-0.36.0+1.17.jar' /minecraft/mods/
COPY --from=minecraft-mod-lithium /minecraft/mods/'lithium-fabric-mc1.17-0.7.2.jar' /minecraft/mods/
COPY --from=minecraft-mod-hydrogen /minecraft/mods/'hydrogen-fabric-mc1.17-0.3.jar' /minecraft/mods/
COPY --from=minecraft-mod-ferrite_core /minecraft/mods/'ferritecore-3.0.0-fabric.jar' /minecraft/mods/
COPY --from=minecraft-mod-lazydfu /minecraft/mods/'lazydfu-0.1.2.jar' /minecraft/mods/
COPY --from=minecraft-mod-smooth_boot /minecraft/mods/'smoothboot-fabric-1.16.5-1.6.0.jar' /minecraft/mods/
COPY --from=minecraft-mod-inventory_sorting /minecraft/mods/'InventorySorter-1.7.9-1.17.jar' /minecraft/mods/
COPY --from=minecraft-mod-voxelmap /minecraft/mods/'fabricmod_VoxelMap-1.10.15_for_1.17.0.jar' /minecraft/mods/
COPY --from=rcon-cli /rcon-cli /
COPY rcon /
COPY log4j2.xml /minecraft/
COPY start health-check /
EXPOSE 25565
ENTRYPOINT ["/start"]
HEALTHCHECK --start-period=1m CMD ["/health-check"]
