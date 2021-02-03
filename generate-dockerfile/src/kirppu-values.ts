import MetadataFetcher from './metadata-fetcher'
import { urlFilename } from './url-filename'

const MINECRAFT_VERSION = '1.16.5'

const MODS: { [name: string]: number } = {
  // https://www.curseforge.com/minecraft/mc-mods/fabric-api
  fabric_api: 306612,

  // https://www.curseforge.com/minecraft/mc-mods/phosphor
  phosphor: 372124,
  // https://www.curseforge.com/minecraft/mc-mods/lithium
  lithium: 360438,
  // Client only: https://www.curseforge.com/minecraft/mc-mods/sodium
  //sodium: 394468,

  // https://www.curseforge.com/minecraft/mc-mods/inventory-sorting
  // TODO: Waiting for 1.16.5 compatibility.
  //inventory_sorting: 325471,
  // https://www.curseforge.com/minecraft/mc-mods/xaeros-minimap-fair-play-edition
  xaeros_minimap_fp: 263466,
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
  urls: string[]
  filename: string
}

// The metadata server gives a URL from one of two mirrors by random. Add URLs
// corresponding to both mirrors to the Dockerfile to avoid introducing diffs
// when no mod was updated.
const FORGE_MIRRORS: [Set<string>] = [
  new Set([
    'https://edge.forgecdn.net/files/',
    'https://edge-service.overwolf.wtf/files/',
  ]),
]

function forgeMirrorsFor(url: string): string[] {
  let urls = new Set([url])

  for (const mirrorSet of FORGE_MIRRORS) {
    for (const mirrorUrlMatch of mirrorSet) {
      if (url.startsWith(mirrorUrlMatch)) {
        const suffix = url.slice(mirrorUrlMatch.length)

        for (const mirrorUrlAdd of mirrorSet) {
          urls.add(mirrorUrlAdd + suffix)
        }

        break
      }
    }
  }

  const urlsArray = Array.from(urls)
  urlsArray.sort()
  return urlsArray
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
        urls: forgeMirrorsFor(url),
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
