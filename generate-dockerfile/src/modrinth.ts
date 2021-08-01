import { Modrinth } from "modrinth";
import type { Version } from "modrinth/src/models/Version";

import { Download } from "./types";

export async function getModDownload(
  modId: string,
  minecraftVersion: string,
  compatibilityOverride?: { filename: string; versions: string[] }
): Promise<Download | null> {
  const modrinth = new Modrinth();
  const mod = await modrinth.mod(modId);
  const versions = await mod.versions();
  const candidates = versions.filter(
    (ver) =>
      (ver.type === "release" || ver.type === "beta") &&
      gameVersions(ver, compatibilityOverride).includes(minecraftVersion) &&
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

function gameVersions(
  version: Version,
  override?: { filename: string; versions: string[] }
): string[] {
  if (override == null) {
    return version.game_versions;
  }

  if (version.files.some((file) => file.filename === override.filename)) {
    return [...(version.game_versions as string[]), ...override.versions];
  } else {
    return version.game_versions;
  }
}
