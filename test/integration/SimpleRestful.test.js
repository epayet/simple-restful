import { expect } from 'chai'
import supertest from 'supertest'
import path from 'path'
import rimraf from 'rimraf'
import simpleRestful from '../../src'
import InMemoryRepository from '../../src/repository/InMemoryRepository'
import fs from 'fs-promise'

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
    describe('with a simple resource: ', function() {
      beforeEach(function() {
        let simpleResource = {
          name: "example",
          repository: "InMemory"
        }
        server.addResource(simpleResource)
      })

      it('should create a server with a simple in memory resource and get an empty collection', function(done) {
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

      it('should add a new data and get 201', function(done) {
        client
          .post('/api/example')
          .send(simpleData)
          .expect("Content-type", /json/)
          .expect(201)
          .end(function(err, res) {
            if (err) throw err;

            expect(res.body).to.deep.equal(simpleDataWithId)
            done()
          })
      })

      describe('when data is added first via post', function() {
        beforeEach(function(cb) {
          client
            .post('/api/example')
            .send(simpleData)
            .end(cb)
        })

        it('should add data and retrieve the collection', function(done) {
          client
            .get('/api/example')
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) throw err;

              expect(res.body).to.deep.equal([simpleDataWithId])
              done()
            })
        })

        it('should add data and retrieve the new one created', function(done) {
          client
            .get(`/api/example/${simpleDataWithId.__id}`)
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) throw err;

              expect(res.body).to.deep.equal(simpleDataWithId)
              done()
            })
        })

        it('should delete the data', function(done) {
          client
            .delete(`/api/example/${simpleDataWithId.__id}`)
            .expect(204)
            .end(function() {
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

        it('should update the data', function(done) {
          let updatedData = { __id: 0, stuff: 'other stuff' }

          client
            .put(`/api/example/${simpleDataWithId.__id}`)
            .send(updatedData)
            .expect(200)
            .end(function(err, res) {
              if (err) throw err;

              client
                .get(`/api/example/${simpleDataWithId.__id}`)
                .expect("Content-type", /json/)
                .expect(200)
                .end(function(err, res) {
                  if (err) throw err;

                  expect(res.body).to.deep.equal(updatedData)
                  done()
                })
            })
        })
      })
    })

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

    before(function(cb) {
      fs.mkdir(testDataFolderPath).then(cb).catch(cb);
    })

    it('should create a file in the correct folder', function(done) {

      let resourceInfo = {
        name: 'example',
        repository: 'File',
        repositoryOptions: {
          folderPath: testDataFolderPath
        }
      }
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

    after(function() {
      rimraf(testDataFolderPath, {}, function(){})
    })
  })
})