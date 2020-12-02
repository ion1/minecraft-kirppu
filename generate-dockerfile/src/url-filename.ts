import { URL } from 'url'

export function basename(path: string): string {
  return path.substr(path.lastIndexOf('/') + 1)
}

export function urlFilename(url: string): string {
  return decodeURIComponent(basename(new URL(url).pathname))
}
