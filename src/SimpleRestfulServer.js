import restify from 'restify'
import winston from 'winston'
import InMemoryRepository from './repository/InMemoryRepository'
import FileRepository from './repository/FileRepository'

export default class SimpleRestfulServer {
  constructor(options) {
    this.options = options
    this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({ level: options.logLevel ? options.logLevel : 'info' })
      ]
    });
    this.createServer()
    this.repositoryClasses = {
      'InMemory': InMemoryRepository,
      'File': FileRepository
    }
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
    let repository = new this.repositoryClasses[resourceInfo.repository](resourceInfo.repositoryOptions)

    this.server.get(`/api/${resourceInfo.name}`, (req, res) => {
      repository.getAll()
        .then(data => res.send(data))
        .catch(error => res.send(500, error))
    })
    this.server.get(`/api/${resourceInfo.name}/:id`, (req, res) => {
      let id = parseInt(req.params['id'])
      repository.get(id)
        .then(data => res.send(data))
        .catch(error => res.send(404, error))
    })
    this.server.post(`/api/${resourceInfo.name}`, (req, res) => {
      repository.add(req.body)
        .then(data => res.send(201, data))
        .catch(error => res.send(500, error))
    })
    this.server.put(`/api/${resourceInfo.name}/:id`, (req, res) => {
      let id = parseInt(req.params['id'])
      repository.update(id, req.body)
        .then(data => res.send(data))
        .catch(error => res.send(500, error))
    })
    this.server.del(`/api/${resourceInfo.name}/:id`, (req, res) => {
      let id = parseInt(req.params['id'])
      repository.delete(id)
        .then(() => res.send(204))
        .catch(error => res.send(500, error))
    })
  }

  addRepository(repositoryName, repositoryClass) {
    this.repositoryClasses[repositoryName] = repositoryClass
  }

  createServer() {
    this.server = restify.createServer()
    this.server.use(restify.bodyParser());
    this.server.get('status', (req, res) => res.send({status: "it's aliiive"}))
  }
}