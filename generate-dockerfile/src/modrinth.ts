import { Modrinth } from "modrinth";

import { Download } from "./types";

export async function getModDownload(
  modId: string,
  minecraftVersion: string
): Promise<Download | null> {
  const modrinth = new Modrinth();
  const mod = await modrinth.mod(modId);
  const versions = await mod.versions();
  const candidates = versions.filter(
    (ver) =>
      (ver.type === "release" || ver.type === "beta") &&
      (ver.game_versions as string[]).includes(minecraftVersion) &&
      ver.loaders.includes("fabric") &&
      ver.files.length === 1
  );
  if (candidates.length === 0) {
    return null;
  }
  const version = candidates.reduce((verA, verB) =>
    verA.date_published > verB.date_published ? verA : verB
  );
  const file = version.files[0];
  return {
    urls: [file.url],
    filename: file.filename,
  };
}
