import * as curseforge from "mc-curseforge-api";
import type ModFile from "mc-curseforge-api";

import { Download } from "./types";
import { urlFilename } from "./url-filename";

export async function getModDownload(
  modId: number,
  minecraftVersion: string,
  compatibilityOverride?: { filename: string; versions: string[] }
): Promise<Download | null> {
  const files = (await curseforge.getModFiles(modId))
    .map(fixFilename)
    .map((file) => applyCompatibilityOverride(file, compatibilityOverride));
  const candidates = files.filter(
    (file) =>
      file.available &&
      parseInt(file.release_type) <= 2 &&
      file.minecraft_versions.includes(minecraftVersion) &&
      file.minecraft_versions.includes("Fabric")
  );
  if (candidates.length === 0) {
    return null;
  }
  const file = candidates.reduce((fileA, fileB) =>
    fileA.timestamp > fileB.timestamp ? fileA : fileB
  );
  return {
    urls: forgeMirrorsFor(file.download_url),
    filename: file.file_name,
  };
}

/** TODO: Pending https://github.com/Mondanzo/mc-curseforge-api/pull/25 */
function fixFilename(file: ModFile): ModFile {
  return Object.assign(Object.create(Object.getPrototypeOf(file)), {
    ...file,
    file_name: urlFilename(file.download_url),
  });
}

function applyCompatibilityOverride(
  file: ModFile,
  override?: { filename: string; versions: string[] }
): ModFile {
  if (override == null) {
    return file;
  }

  if (file.file_name === override.filename) {
    return Object.assign(Object.create(Object.getPrototypeOf(file)), {
      ...file,
      minecraft_versions: [...file.minecraft_versions, ...override.versions],
    });
  } else {
    return file;
  }
}

// The metadata server gives a URL from one of two mirrors by random. Add URLs
// corresponding to both mirrors to the Dockerfile to avoid introducing diffs
// when no mod was updated.
const FORGE_MIRRORS: [Set<string>] = [
  new Set([
    "https://edge.forgecdn.net/files/",
    "https://edge-service.overwolf.wtf/files/",
  ]),
];

function forgeMirrorsFor(url: string): string[] {
  const urls = new Set([url]);

  for (const mirrorSet of FORGE_MIRRORS) {
    for (const mirrorUrlMatch of mirrorSet) {
      if (url.startsWith(mirrorUrlMatch)) {
        const suffix = url.slice(mirrorUrlMatch.length);

        for (const mirrorUrlAdd of mirrorSet) {
          urls.add(mirrorUrlAdd + suffix);
        }

        break;
      }
    }
  }

  const urlsArray = Array.from(urls);
  urlsArray.sort();
  return urlsArray;
}
