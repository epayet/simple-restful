import { expect } from 'chai'
import sinon from 'sinon'
import restify from 'restify'
import SimpleRestfulServer from '../../src/SimpleRestfulServer'

describe('SimpleRestfulServer', function() {
  let restifySpies = {}
  let server, options

  beforeEach(function() {
    restifySpies.get = sinon.spy()
    restifySpies.listen = sinon.spy()
    sinon.stub(restify, 'createServer').returns({ get: restifySpies.get, listen: restifySpies.listen })
  })

  beforeEach(function() {
    options = { port: 9999 }
    server = new SimpleRestfulServer(options)
  })

  afterEach(function() {
    restify.createServer.restore()
  })

  it('should create a server with a status route', function() {
    expect(restify.createServer.called).to.equal(true)
    expect(restifySpies.get.calledWith('status')).to.equal(true)
  })

  describe('start', function() {
    it('should listen to a port', function() {
      server.start()
      expect(restifySpies.listen.calledWith(options.port))
    })
  })
})