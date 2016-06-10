import restify from 'restify'
import { createRepository } from './repository/repositoryFactory'
import winston from 'winston'

export default class SimpleRestfulServer {
  constructor(options) {
    this.options = options
    this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({ level: options.logLevel ? options.logLevel : 'info' })
      ]
    });
    this.createServer()
  }

  start() {
    this.server.listen(this.options.port, () => {
      this.logger.info(`Server started at http:localhost:${this.options.port}`)
    })
  }

  stop() {
    this.server.close()
  }

  addResource(resourceInfo) {
    let repository = createRepository(resourceInfo.repository, resourceInfo.repositoryOptions)

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