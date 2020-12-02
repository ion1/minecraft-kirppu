import { promises as fs } from 'fs'
import path = require('path')
import shellescape = require('shell-escape')
import { Liquid } from 'liquidjs'

import getKirppuValues from './kirppu-values'

export async function writeDockerfile(directory: string) {
  await fs.writeFile(
    path.join(directory, 'Dockerfile'),
    await renderDockerfile(directory),
  )
}

export async function renderDockerfile(directory: string): Promise<string> {
  const engine = new Liquid({
    root: directory,
    extname: '.liquid',
    greedy: false,
  })
  engine.registerFilter('shell_escape', str => shellescape([str]))

  return await engine.renderFile('Dockerfile', await getKirppuValues())
}
