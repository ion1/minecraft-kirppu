# Dockerfile is generated from Dockerfile.liquid

# Use the same image as itzg/minecraft-server.
FROM adoptopenjdk:16-jre AS minecraft-base
RUN apt-get update
RUN \
  DEBIAN_FRONTEND=noninteractive apt-get -y dist-upgrade && \
  apt-get clean
RUN \
  addgroup --gid 1000 minecraft && \
  adduser --system --home /minecraft --shell /bin/false --uid 1000 --ingroup minecraft minecraft && \
  mkdir -p /minecraft/server /minecraft/mods && \
  chown -R minecraft:minecraft /minecraft

FROM minecraft-base AS minecraft-download
RUN \
  DEBIAN_FRONTEND=noninteractive apt-get install -y wget && \
  apt-get clean
COPY download-mod /

FROM minecraft-download AS minecraft-server
USER minecraft
WORKDIR /minecraft/server
RUN wget -nc -O ../fabric-installer.jar 'https://maven.fabricmc.net/net/fabricmc/fabric-installer/0.7.4/fabric-installer-0.7.4.jar'
RUN \
  java -jar ../fabric-installer.jar server \
  -mcversion '1.17.1' \
  -loaderversion '0.11.6' \
  -downloadMinecraft

FROM minecraft-download AS minecraft-mod-fabric_api
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'fabric-api-0.39.2+1.17.jar' 'https://cdn.modrinth.com/data/P7dR8mSH/versions/0.39.2+1.17/fabric-api-0.39.2+1.17.jar'

FROM minecraft-download AS minecraft-mod-lithium
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'lithium-fabric-mc1.17.1-0.7.4.jar' 'https://cdn.modrinth.com/data/gvQqBUqZ/versions/mc1.17.1-0.7.4/lithium-fabric-mc1.17.1-0.7.4.jar'

FROM minecraft-download AS minecraft-mod-hydrogen
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'hydrogen-fabric-mc1.17.1-0.3.jar' 'https://cdn.modrinth.com/data/AZomiSrC/versions/mc1.17.1-0.3.1/hydrogen-fabric-mc1.17.1-0.3.jar'

FROM minecraft-download AS minecraft-mod-ferrite_core
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'ferritecore-3.0.3-fabric.jar' 'https://cdn.modrinth.com/data/uXXizFIs/versions/3.0.3/ferritecore-3.0.3-fabric.jar'

FROM minecraft-download AS minecraft-mod-lazydfu
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'lazydfu-0.1.2.jar' 'https://cdn.modrinth.com/data/hvFnDODi/versions/0.1.2/lazydfu-0.1.2.jar'

FROM minecraft-download AS minecraft-mod-smooth_boot
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'smoothboot-fabric-1.16.5-1.6.0.jar' 'https://cdn.modrinth.com/data/FWumhS4T/versions/1.16.5-1.6.0/smoothboot-fabric-1.16.5-1.6.0.jar'

FROM minecraft-download AS minecraft-mod-recipe_cache
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'recipecache-0.2.0-1.17.1.jar' 'https://edge-service.overwolf.wtf/files/3369/522/recipecache-0.2.0-1.17.1.jar' 'https://edge.forgecdn.net/files/3369/522/recipecache-0.2.0-1.17.1.jar'

FROM minecraft-download AS minecraft-mod-servux
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'servux-fabric-1.17.0-0.1.0.jar' 'https://edge-service.overwolf.wtf/files/3345/645/servux-fabric-1.17.0-0.1.0.jar' 'https://edge.forgecdn.net/files/3345/645/servux-fabric-1.17.0-0.1.0.jar'

FROM minecraft-download AS minecraft-mod-inventory_sorting
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'InventorySorter-1.8.0-1.17.jar' 'https://edge-service.overwolf.wtf/files/3438/282/InventorySorter-1.8.0-1.17.jar' 'https://edge.forgecdn.net/files/3438/282/InventorySorter-1.8.0-1.17.jar'

FROM minecraft-download AS minecraft-mod-xaeros_minimap_fair_play_edition
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'Xaeros_Minimap_FP21.15.1_Fabric_1.17.1.jar' 'https://edge-service.overwolf.wtf/files/3430/248/Xaeros_Minimap_FP21.15.1_Fabric_1.17.1.jar' 'https://edge.forgecdn.net/files/3430/248/Xaeros_Minimap_FP21.15.1_Fabric_1.17.1.jar'

FROM minecraft-download AS minecraft-mod-xaeros_world_map
USER minecraft
WORKDIR /minecraft/mods
RUN /download-mod 'XaerosWorldMap_1.16.1_Fabric_1.17.1.jar' 'https://edge-service.overwolf.wtf/files/3423/299/XaerosWorldMap_1.16.1_Fabric_1.17.1.jar' 'https://edge.forgecdn.net/files/3423/299/XaerosWorldMap_1.16.1_Fabric_1.17.1.jar'

FROM minecraft-base
VOLUME /data
RUN \
  mkdir -p /data && \
  chown -R minecraft:minecraft /data
USER minecraft
WORKDIR /data

COPY --from=minecraft-server /minecraft/server/*.jar /minecraft/server/
COPY --from=itzg/minecraft-server /usr/local/bin/mc-server-runner /usr/local/bin/
COPY --from=itzg/minecraft-server /usr/local/bin/mc-monitor /usr/local/bin/
COPY --from=itzg/minecraft-server /usr/local/bin/rcon-cli /usr/local/bin/
COPY --from=minecraft-mod-fabric_api /minecraft/mods/'fabric-api-0.39.2+1.17.jar' /minecraft/mods/
COPY --from=minecraft-mod-lithium /minecraft/mods/'lithium-fabric-mc1.17.1-0.7.4.jar' /minecraft/mods/
COPY --from=minecraft-mod-hydrogen /minecraft/mods/'hydrogen-fabric-mc1.17.1-0.3.jar' /minecraft/mods/
COPY --from=minecraft-mod-ferrite_core /minecraft/mods/'ferritecore-3.0.3-fabric.jar' /minecraft/mods/
COPY --from=minecraft-mod-lazydfu /minecraft/mods/'lazydfu-0.1.2.jar' /minecraft/mods/
COPY --from=minecraft-mod-smooth_boot /minecraft/mods/'smoothboot-fabric-1.16.5-1.6.0.jar' /minecraft/mods/
COPY --from=minecraft-mod-recipe_cache /minecraft/mods/'recipecache-0.2.0-1.17.1.jar' /minecraft/mods/
COPY --from=minecraft-mod-servux /minecraft/mods/'servux-fabric-1.17.0-0.1.0.jar' /minecraft/mods/
COPY --from=minecraft-mod-inventory_sorting /minecraft/mods/'InventorySorter-1.8.0-1.17.jar' /minecraft/mods/
COPY --from=minecraft-mod-xaeros_minimap_fair_play_edition /minecraft/mods/'Xaeros_Minimap_FP21.15.1_Fabric_1.17.1.jar' /minecraft/mods/
COPY --from=minecraft-mod-xaeros_world_map /minecraft/mods/'XaerosWorldMap_1.16.1_Fabric_1.17.1.jar' /minecraft/mods/
COPY rcon /
COPY log4j2.xml /minecraft/
COPY start health-check /
EXPOSE 25565
ENTRYPOINT ["/start"]
HEALTHCHECK --start-period=1m CMD ["/health-check"]
