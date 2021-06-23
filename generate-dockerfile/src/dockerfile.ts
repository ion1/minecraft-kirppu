import shellescape from "shell-escape";
import { Liquid } from "liquidjs";
import matter from "gray-matter";
import Ajv, { JSONSchemaType } from "ajv";

import { Download } from "./types";
import * as fabric from "./fabric";
import * as modrinth from "./modrinth";
import * as curseforge from "./curseforge";

type DockerfileEnvironment = {
  minecraftVersion: string;

  fabricInstallerURL: string;
  fabricLoaderVersion: string;

  mods: DockerfileDownload[];
};

type DockerfileDownload = {
  id: string;
  urls: string[];
  filename: string;
};

type Frontmatter = {
  minecraft_version: string;
  mods: Record<string, FrontmatterMod>;
};

type FrontmatterMod = {
  id: FrontmatterModId;
};

type FrontmatterModId = { modrinth: string } | { curseforge: number };

const modIdSchema: JSONSchemaType<FrontmatterModId> = {
  type: "object",
  required: [],
  oneOf: [
    {
      required: ["modrinth"],
      properties: { modrinth: { type: "string" } },
    },
    {
      required: ["curseforge"],
      properties: { curseforge: { type: "integer" } },
    },
  ],
};

const modSchema: JSONSchemaType<FrontmatterMod> = {
  type: "object",
  required: ["id"],
  properties: {
    id: modIdSchema,
  },
};

const frontmatterSchema: JSONSchemaType<Frontmatter> = {
  type: "object",
  required: ["minecraft_version", "mods"],
  properties: {
    minecraft_version: { type: "string" },
    mods: {
      type: "object",
      required: [],
      additionalProperties: modSchema,
    },
  },
};

const validateFrontmatter = new Ajv().compile(frontmatterSchema);

export async function renderDockerfile(
  templateString: string
): Promise<string> {
  const template = matter(templateString);
  const data = template.data;
  if (!validateFrontmatter(data)) {
    throw new Error(
      `Failed to parse the front matter: ${JSON.stringify(
        validateFrontmatter.errors
      )}`
    );
  }

  const environment = await dockerfileEnvironment(
    data.minecraft_version,
    data.mods
  );

  const engine = new Liquid({ greedy: false });
  engine.registerFilter("shell_escape", (str) => shellescape([str]));

  return (await engine.parseAndRender(template.content, environment)) as string;
}

async function dockerfileEnvironment(
  minecraftVersion: string,
  frontmatterMods: Record<string, FrontmatterMod>
): Promise<DockerfileEnvironment> {
  const [fabricInstallerURL, fabricLoaderVersion, dockerfileMods] =
    await Promise.all([
      fabric.getInstallerURL(),
      fabric.getLoaderVersion(minecraftVersion),
      Promise.all(
        Object.entries(frontmatterMods).map(async ([downloadId, mod]) => {
          const { id } = mod;
          let download: Download | null = null;

          if ("modrinth" in id) {
            download = await modrinth.getModDownload(
              id.modrinth,
              minecraftVersion
            );
          } else if ("curseforge" in id) {
            download = await curseforge.getModDownload(
              id.curseforge,
              minecraftVersion
            );
          } else {
            const impossible: never = id;
            throw new Error(
              `Impossible frontmatter mod ID: ${JSON.stringify(impossible)}`
            );
          }

          if (download != null) {
            return {
              id: downloadId,
              urls: download.urls,
              filename: download.filename,
            };
          } else {
            throw new Error(`No compatible files for ${downloadId} ${JSON.stringify(
              mod
            )}`);
          }
        })
      ),
    ]);

  return {
    minecraftVersion,
    fabricInstallerURL,
    fabricLoaderVersion,
    mods: dockerfileMods,
  };
}
