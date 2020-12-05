import path = require('path')
import shellescape = require('shell-escape')
import { Liquid } from 'liquidjs'

import getKirppuValues from './kirppu-values'

export async function renderDockerfile(template: string): Promise<string> {
  const engine = new Liquid({ greedy: false })
  engine.registerFilter('shell_escape', str => shellescape([str]))

  return await engine.parseAndRender(template, await getKirppuValues())
}
