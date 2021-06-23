import { Command, flags } from "@oclif/command";
import getStdin from "get-stdin";

import { renderDockerfile } from "./dockerfile";
class GenerateDockerfile extends Command {
  static description = "Generate the Minecraft Dockerfile";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run(): Promise<void> {
    this.parse(GenerateDockerfile);

    process.stdout.write(await renderDockerfile(await getStdin()));
  }
}

export = GenerateDockerfile;
