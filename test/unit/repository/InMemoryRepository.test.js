import { expect } from 'chai'
import InMemoryRepository from '../../../src/repository/InMemoryRepository'

describe('Unit: InMemoryRepository', function() {
  let repository

  beforeEach(function() {
    repository = new InMemoryRepository()
  })

  describe('init', function() {
    it('should have default data', function(done) {
      let defaultData = [{__id: 1, stuff: 'stuff'}]
      repository = new InMemoryRepository({defaultData})

      repository.getAll()
        .then(data => {
          expect(data).to.deep.equal(defaultData)
          done()
        })
    })
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

  describe('getAll', function() {
    it('should get an empty array', function(done) {
      repository.getAll()
        .then(allData => {
          expect(allData).to.deep.equal([])
          done()
        })
    })

    it('should the existing data as a collection', function(done) {
      repository.data = [{stuff: 'stuff'}]

      repository.getAll()
        .then(allData => {
          expect(allData).to.deep.equal(repository.data)
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

  describe('update', function() {
    it('should update the data', function(done) {
      repository.data = [{__id: 0, stuff: 'stuff'}]
      let dataWithNewValues = {__id: 0, stuff: 'other stuff'}

      repository.update(0, dataWithNewValues)
        .then(updatedData => {
          expect(repository.data).to.deep.equal([dataWithNewValues])
          done()
        })
    })
  })
})