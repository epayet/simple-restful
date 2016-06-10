import { expect } from 'chai'
import sinon from 'sinon'
import restify from 'restify'
import SimpleRestfulServer from '../../src/SimpleRestfulServer'

describe('Unit: SimpleRestfulServer', function() {
  let restifySpies = {}
  let server, options

  beforeEach(function() {
    restifySpies.get = sinon.spy()
    restifySpies.listen = sinon.spy()
    restifySpies.post = sinon.spy()
    restifySpies.put = sinon.spy()
    restifySpies.del = sinon.spy()
    restifySpies.close = sinon.spy()
    sinon.stub(restify, 'createServer').returns({
      get: restifySpies.get,
      listen: restifySpies.listen,
      post: restifySpies.post,
      put: restifySpies.put,
      del: restifySpies.del,
      close: restifySpies.close,
      use: sinon.spy()
    })
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
      expect(restifySpies.listen.calledWith(options.port)).to.equal(true)
    })
  })

  describe('stop', function() {
    it('should close the server', function() {
      server.stop()
      expect(restifySpies.close.called).to.equal(true)
    })
  })

  describe('addResource', function() {
    it('should add routes to the server', function() {
      let resourceInfo = {
        name: 'test',
        repository: 'InMemory'
      }
      server.addResource(resourceInfo)
      expect(restifySpies.get.calledWith(`/api/${resourceInfo.name}`)).to.equal(true)
      expect(restifySpies.get.calledWith(`/api/${resourceInfo.name}/:id`)).to.equal(true)
      expect(restifySpies.post.calledWith(`/api/${resourceInfo.name}`)).to.equal(true)
      expect(restifySpies.put.calledWith(`/api/${resourceInfo.name}/:id`)).to.equal(true)
      expect(restifySpies.del.calledWith(`/api/${resourceInfo.name}/:id`)).to.equal(true)
    })
  })
})