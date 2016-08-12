import InMemoryRepository from './InMemoryRepository'
import FileRepository from './FileRepository'

export function createRepository(repositoryType, repositoryOptions) {
  switch (repositoryType) {
    case 'InMemory':
    default:
      return new InMemoryRepository(repositoryOptions)

    case 'File':
      return new FileRepository(repositoryOptions)
  }
}