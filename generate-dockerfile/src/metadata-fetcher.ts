import fetch from 'node-fetch'

// https://meta.fabricmc.net/v2/versions/installer
export interface FabricInstaller {
  url: string
  stable: boolean
}

// https://meta.fabricmc.net/v2/versions/loader/1.16.3
export interface FabricLoaderForVersion {
  loader: FabricLoader
}

export interface FabricLoader {
  version: string
  stable: boolean
}

// https://twitchappapi.docs.apiary.io/#/reference/0/get-addon-files
export interface ModFile {
  displayName: string
  fileDate: string
  downloadUrl: string
  isAvailable: boolean
  isAlternate: boolean
  releaseType: number
  gameVersion: [string]
}

export default class MetadataFetcher {
  minecraftVersion: string

  constructor(minecraftVersion: string) {
    this.minecraftVersion = minecraftVersion
  }

  async getFabricInstallerURL(): Promise<string> {
    return (await this.getFabricInstaller()).url
  }

  async getFabricInstaller(): Promise<FabricInstaller> {
    return await this.getData(
      'https://meta.fabricmc.net/v2/versions/installer',

      (installers: [FabricInstaller]) => installers.filter(installer => installer.stable),

      'No stable Fabric installer found',

      (installers: [FabricInstaller]) => installers[0]
    )
  }

  async getFabricLoaderVersion(): Promise<string> {
    return (await this.getFabricLoader()).version
  }

  async getFabricLoader(): Promise<FabricLoader> {
    return await this.getData(
      `https://meta.fabricmc.net/v2/versions/loader/${encodeURIComponent(this.minecraftVersion)}`,

      (lfvs: [FabricLoaderForVersion]) =>
        lfvs.map((lfv) => lfv.loader).filter((loader) => loader.stable),

      `No stable Fabric loader for Minecraft ${this.minecraftVersion} found`,

      (loaders: [FabricLoader]) => loaders[0]
    )
  }

  async getModFileURL(modId: number): Promise<string> {
    return (await this.getModFile(modId)).downloadUrl
  }

  async getModFile(modId: number): Promise<ModFile> {
    return await this.getData(
      `https://addons-ecs.forgesvc.net/api/v2/addon/${encodeURIComponent(modId)}/files`,

      (files: [ModFile]) => files.filter(file =>
        file.isAvailable &&
        !file.isAlternate &&
        file.releaseType <= 2 &&
        file.gameVersion.includes(this.minecraftVersion) &&
        file.gameVersion.includes('Fabric')
      ),

      `No compatible files for mod ${modId}`,

      (files: [ModFile]) => files.reduce((fileA, fileB) =>
        fileA.fileDate > fileB.fileDate ? fileA : fileB
      )
    )
  }

  async getData<S, T>(
    uri: string,
    mapFilter: (items: S[]) => T[],
    notFoundError: string,
    select: (items: T[]) => T
  ): Promise<T> {
    const res = await fetch(uri)
    const candidates = mapFilter(await res.json())
    if (candidates.length === 0) {
      throw new Error(notFoundError)
    }
    return select(candidates)
  }
}
