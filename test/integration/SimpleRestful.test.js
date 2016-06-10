import { expect } from 'chai'
import supertest from 'supertest'
import simpleRestful from '../../src'
import InMemoryRepository from '../../src/repository/InMemoryRepository'

describe('Integration: SimpleRestful', function() {
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

  describe('simple resource', function() {
    let simpleData = { stuff: 'stuff' }
    let simpleDataWithId = { __id: 0, stuff: 'stuff' }

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
})