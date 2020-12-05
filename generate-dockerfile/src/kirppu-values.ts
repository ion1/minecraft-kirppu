import MetadataFetcher from './metadata-fetcher'
import { urlFilename } from './url-filename'

const MINECRAFT_VERSION = '1.16.4'

const MODS: { [name: string]: number } = {
  // https://www.curseforge.com/minecraft/mc-mods/fabric-api
  fabric_api: 306612,
  // https://www.curseforge.com/minecraft/mc-mods/inventory-sorting
  inventory_sorting: 325471,
  // https://www.curseforge.com/minecraft/mc-mods/xaeros-minimap
  xaeros_minimap: 263420,
  // https://www.curseforge.com/minecraft/mc-mods/xaeros-world-map
  xaeros_world_map: 317780,
}

export interface KirppuValues {
  minecraftVersion: string

  fabricInstallerURL: string
  fabricLoaderVersion: string

  mods: Download[]
}

export interface Download {
  id: string
  url: string
  filename: string
}

export default async function getKirppuValues(): Promise<KirppuValues> {
  const metadata = new MetadataFetcher(MINECRAFT_VERSION)

  const [
    fabricInstallerURL,
    fabricLoaderVersion,
    mods,
  ] = await Promise.all([
    metadata.getFabricInstallerURL(),
    metadata.getFabricLoaderVersion(),
    Promise.all(Object.values(MODS).map(async (modId) => {
      const url = await metadata.getModFileURL(modId)
      return {
        id: `${modId}`,
        url,
        filename: urlFilename(url),
      }
    })),
  ])

  return {
    minecraftVersion: metadata.minecraftVersion,
    fabricInstallerURL,
    fabricLoaderVersion,
    mods,
  }
}
