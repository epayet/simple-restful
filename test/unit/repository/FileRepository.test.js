import sinon from 'sinon'
import { expect } from 'chai'
import fs from 'fs-promise'
import FileRepository from '../../../src/repository/FileRepository'

describe('Unit: FileRepository', function() {
  describe('add', function() {
    beforeEach(function() {
      sinon.stub(fs, 'writeFile').returns(Promise.resolve())
    })

    afterEach(function() {
      fs.writeFile.restore()
    })

    it('should create the first data', function(done) {
      let options = {
        folderPath: 'test'
      }
      let repository = new FileRepository(options)
      let newData = {stuff: 'stuff'}

      repository.add(newData)
        .then(() => {
          expect(fs.writeFile.calledWith('test/0.json', JSON.stringify(newData))).to.equal(true)
          done()
        })
        .catch(done)
    })
  })
})