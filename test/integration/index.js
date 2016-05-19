import { expect } from 'chai'
import supertest from 'supertest'
import simpleRestful from '../../src'

describe('SimpleRestful', function() {
  let client

  beforeEach(function() {
    let options = { port: 9999 }
    let server = simpleRestful.createServer(options)
    server.start()
    client = supertest.agent(`http://localhost:${options.port}`)
  })

  it('should create a server with a specific port and be alive', function(done) {
    client
    .get('/status')
    .expect("Content-type", /json/)
    .expect(200)
    .end(function(err, res) {
      let expectedResponse = { status: "it's aliiive"}
      expect(res.body).to.deep.equal(expectedResponse)
      done()
    })
  })
})