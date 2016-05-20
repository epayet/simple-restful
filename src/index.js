import SimpleRestfulServer from './SimpleRestfulServer'
import InMemoryRepository from './repositories/InMemoryRepository'

export default {
  createServer: function(options) {
    return new SimpleRestfulServer(options)
  },

  repositories: { InMemory: InMemoryRepository }
}