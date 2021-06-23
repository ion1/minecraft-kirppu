import fetch from "node-fetch";

// https://meta.fabricmc.net/v2/versions/installer
export type Installer = {
  url: string;
  stable: boolean;
};

// https://meta.fabricmc.net/v2/versions/loader/1.16.3
export type LoaderForVersion = {
  loader: Loader;
};

export type Loader = {
  version: string;
  stable: boolean;
};

export async function getInstallerURL(): Promise<string> {
  return (await getInstaller()).url;
}

export async function getInstaller(): Promise<Installer> {
  return await getData(
    "https://meta.fabricmc.net/v2/versions/installer",

    (installers: Installer[]) =>
      installers.filter((installer) => installer.stable),

    "No stable Fabric installer found",

    (installers: Installer[]) => installers[0]
  );
}

export async function getLoaderVersion(
  minecraftVersion: string
): Promise<string> {
  return (await getLoader(minecraftVersion)).version;
}

export async function getLoader(minecraftVersion: string): Promise<Loader> {
  return await getData(
    `https://meta.fabricmc.net/v2/versions/loader/${encodeURIComponent(
      minecraftVersion
    )}`,

    (lfvs: LoaderForVersion[]) =>
      lfvs.map((lfv) => lfv.loader).filter((loader) => loader.stable),

    `No stable Fabric loader for Minecraft ${minecraftVersion} found`,

    (loaders: Loader[]) => loaders[0]
  );
}

async function getData<S, T>(
  uri: string,
  mapFilter: (items: S[]) => T[],
  notFoundError: string,
  select: (items: T[]) => T
): Promise<T> {
  const res = await fetch(uri);
  const candidates = mapFilter(await res.json());
  if (candidates.length === 0) {
    throw new Error(notFoundError);
  }
  return select(candidates);
}
