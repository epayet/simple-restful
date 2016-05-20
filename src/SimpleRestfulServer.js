import restify from 'restify'

export default class SimpleRestfulServer {
  constructor(options) {
    this.options = options
    this.createServer()
  }

  start() {
    this.server.listen(this.options.port, () => {
      // TODO better logging
      console.log(`Server started at http:localhost:${this.options.port}`)
    })
  }

  stop() {
    this.server.close()
  }

  addResource(resourceInfo) {
    let repository = resourceInfo.repository

    this.server.get(`/api/${resourceInfo.name}`, (req, res) => {
      res.send(repository.getAll())
    })
    this.server.get(`/api/${resourceInfo.name}/:${resourceInfo.idField}`, (req, res) => {
      res.send(repository.get(req.params[resourceInfo.idField]))
    })
    this.server.post(`/api/${resourceInfo.name}`, (req, res) => {
      res.send(repository.add(req.body))
    })
    this.server.put(`/api/${resourceInfo.name}/:${resourceInfo.idField}`, (req, res) => {
      res.send(repository.update(req.body))
    })
    this.server.del(`/api/${resourceInfo.name}/:${resourceInfo.idField}`, (req, res) => {
      res.send(repository.delete(req.params[resourceInfo.idField]))
    })
  }

  createServer() {
    this.server = restify.createServer()
    this.server.get('status', (req, res) => res.send({status: "it's aliiive"}))
  }
}