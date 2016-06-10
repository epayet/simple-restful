import { expect } from 'chai'
import InMemoryRepository from '../../../src/repository/InMemoryRepository'

describe('Unit: InMemoryRepository', function() {
  describe('add', function() {
    it('should add data, the new data should have a new id', function(done) {
      let repository = new InMemoryRepository()

      let data = {stuff: 'stuff'}
      let expectedData = {__id: 0, stuff: 'stuff'}

      repository.add(data)
        .then(newData => {
          expect(newData).to.deep.equal(expectedData)
          done()
        })
    })
  })
})