import * as curseforge from "mc-curseforge-api";

import { Download } from "./types";
import { urlFilename } from "./url-filename";

export async function getModDownload(
  modId: number,
  minecraftVersion: string
): Promise<Download | null> {
  const files = await curseforge.getModFiles(modId);
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
    filename: urlFilename(file.download_url),
  };
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
