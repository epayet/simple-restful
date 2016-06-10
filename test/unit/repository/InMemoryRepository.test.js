import { expect } from 'chai'
import InMemoryRepository from '../../../src/repository/InMemoryRepository'

describe('Unit: InMemoryRepository', function() {
  let repository

  beforeEach(function() {
    repository = new InMemoryRepository()
  })

  describe('add', function() {
    it('should add data, the new data should have a new id', function(done) {
      let data = {stuff: 'stuff'}
      let expectedData = {__id: 0, stuff: 'stuff'}

      repository.add(data)
        .then(newData => {
          expect(newData).to.deep.equal(expectedData)
          done()
        })
    })
  })

  describe('get', function() {
    it('should get a specific id', function(done) {
      let simpleData = {__id: 0, stuff: 'stuff'}
      repository.data = [simpleData]

      repository.get(simpleData.__id)
        .then(data => {
          expect(data).to.deep.equal(simpleData)
          done()
        })
    })
  })

  describe('delete', function() {
    it('should delete the data', function(done) {
      repository.data = [{__id: 0, stuff: 'stuff'}]

      repository.delete(0)
        .then(() => {
          expect(repository.data).to.deep.equal([])
          done()
        })
    })
  })
})