import SimpleRestfulServer from './SimpleRestfulServer'
import InMemoryRepository from './repository/InMemoryRepository'

export default {
  createServer: function(options) {
    return new SimpleRestfulServer(options)
  }
}