import { Command, flags } from '@oclif/command'
import getStdin = require('get-stdin')

import { renderDockerfile } from './kirppu-dockerfile'
class GenerateDockerfile extends Command {
  static description = 'Generate the minecraft-kirppu Dockerfile'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  async run() {
    const { } = this.parse(GenerateDockerfile)

    process.stdout.write(await renderDockerfile(await getStdin()))
  }
}

export = GenerateDockerfile
