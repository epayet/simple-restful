import SimpleRestfulServer from './SimpleRestfulServer'

export default {
  createServer: function(options) {
    return new SimpleRestfulServer(options)
  }
}