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
      repository.getAll().then(data => res.send(data))
    })
    this.server.get(`/api/${resourceInfo.name}/:id`, (req, res) => {
      let id = parseInt(req.params['id'])
      repository.get(id).then(data => res.send(data))
    })
    this.server.post(`/api/${resourceInfo.name}`, (req, res) => {
      repository.add(req.body).then(data => res.send(201, data))
    })
    this.server.put(`/api/${resourceInfo.name}/:id`, (req, res) => {
      repository.update(req.body).then(data => res.send(data))
    })
    this.server.del(`/api/${resourceInfo.name}/:id`, (req, res) => {
      let id = parseInt(req.params['id'])
      repository.delete(id).then(() => res.send(204))
    })
  }

  createServer() {
    this.server = restify.createServer()
    this.server.use(restify.bodyParser());
    this.server.get('status', (req, res) => res.send({status: "it's aliiive"}))
  }
}