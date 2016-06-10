import { expect } from 'chai'
import supertest from 'supertest'
import simpleRestful from '../../src'
import InMemoryRepository from '../../src/repository/InMemoryRepository'

describe('SimpleRestful', function() {
  let client, server

  beforeEach(function() {
    let options = {
      port: 9999,
      logLevel: 'error'
    }
    server = simpleRestful.createServer(options)
    server.start()
    client = supertest.agent(`http://localhost:${options.port}`)
  })

  afterEach(function() {
    server.stop()
  })

  it('should create a server with a specific port and be alive', function(done) {
    client
    .get('/status')
    .expect("Content-type", /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
      let expectedResponse = { status: "it's aliiive" }
      expect(res.body).to.deep.equal(expectedResponse)
      done()
    })
  })

  it('should create a server with a simple in memory resource and get an empty collection', function(done) {
    let simpleResource = {
      name: "example",
      idField: "id",
      repository: "InMemory"
    }
    server.addResource(simpleResource)

    client
      .get('/api/example')
      .expect("Content-type", /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        expect(res.body).to.deep.equal([])
        done()
      })
  })
})