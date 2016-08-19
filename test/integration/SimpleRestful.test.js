import { expect } from 'chai'
import supertest from 'supertest'
import path from 'path'
import rimraf from 'rimraf'
import simpleRestful from '../../src'
import InMemoryRepository from '../../src/repository/InMemoryRepository'
import fs from 'fs-promise'
import { testRepository } from './_Repository.test'

describe('Integration: SimpleRestful', function() {
  let client, server
  let simpleData = { stuff: 'stuff' }
  let simpleDataWithId = { __id: 0, stuff: 'stuff' }

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

  describe('InMemory: ', function() {
    let simpleResource = {
      name: "example",
      repository: "InMemory"
    }

    testRepository({simpleResource})

    it('should be possible to set up options for resources', function(done) {
      let defaultResource = {__id: 1, stuff: 'stuff'}
      let simpleResource = {
        name: "example",
        repository: "InMemory",
        repositoryOptions: {
          defaultData: [defaultResource]
        }
      }
      server.addResource(simpleResource)

      client
        .get('/api/example/1')
        .expect("Content-type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;

          expect(res.body).to.deep.equal(defaultResource)
          done()
        })
    })
  })

  describe('File', function() {
    let testDataFolderPath = path.join(__dirname, 'testData')
    let resourceInfo = {
      name: 'example',
      repository: 'File',
      repositoryOptions: {
        folderPath: testDataFolderPath
      }
    }

    it('should create a file in the correct folder', function(done) {
      server.addResource(resourceInfo)

      client
        .post('/api/example')
        .send(simpleData)
        .expect("Content-type", /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) throw err;

          expect(res.body).to.deep.equal(simpleDataWithId)
          fs.readFile(path.join(testDataFolderPath, '0.json'), 'utf8')
            .then(content => {
              expect(JSON.parse(content)).deep.equal(simpleDataWithId)
              done()
            })
            .catch(done)
        })
    })

    testRepository({simpleResource: resourceInfo})

    afterEach(function() {
      rimraf(testDataFolderPath, {}, function(){})
    })
  })
})