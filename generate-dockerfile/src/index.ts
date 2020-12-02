import { Command, flags } from '@oclif/command'

import { writeDockerfile } from './kirppu-dockerfile'
class GenerateDockerfile extends Command {
  static description = 'Generate the minecraft-kirppu Dockerfile'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [{ name: 'directory', required: true }]

  async run() {
    const { args } = this.parse(GenerateDockerfile)

    writeDockerfile(args.directory)
  }
}

export = GenerateDockerfile
