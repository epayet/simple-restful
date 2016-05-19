import restify from 'restify'

export default class SimpleRestfulServer {
  constructor(options) {
    this.options = options
    this.createServer()
  }

  start() {
    this.server.listen(this.options.port, () => {
      console.log(`Server started at http:localhost:${this.options.port}`)
    })
  }

  createServer() {
    this.server = restify.createServer()
    this.server.get('status', (req, res) => res.send({status: "it's aliiive"}))
  }
}