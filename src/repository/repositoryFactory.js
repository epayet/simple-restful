import InMemoryRepository from './InMemoryRepository'

export function createRepository(repositoryType, repositoryOptions) {
  return new InMemoryRepository(repositoryOptions)
}