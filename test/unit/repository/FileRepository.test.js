import sinon from 'sinon'
import { expect } from 'chai'
import fsp from 'fs-promise'
import fs from 'fs'
import FileRepository from '../../../src/repository/FileRepository'

describe('Unit: FileRepository', function() {
  let repository

  beforeEach(function() {
    let options = {
      folderPath: 'test'
    }
    repository = new FileRepository(options)
  })

  beforeEach(function() {
    sinon.stub(fsp, 'writeFile').returns(Promise.resolve())
    sinon.stub(fsp, 'readFile')
    sinon.stub(fsp, 'unlink').returns(Promise.resolve())
    sinon.stub(fsp, 'readdir')

    sinon.stub(fs, 'existsSync').returns(true)
    sinon.stub(fs, 'mkdirSync')
  })

  afterEach(function() {
    fsp.writeFile.restore()
    fsp.readFile.restore()
    fsp.unlink.restore()
    fsp.readdir.restore()

    fs.mkdirSync.restore()
    fs.existsSync.restore()
  })

  describe('init', function() {
    it('should raise an error if the folder path is undefined', function() {
      expect(() => new FileRepository()).to.throw(Error)
    })
  })

  describe('add', function() {
    let newData = {stuff: 'stuff'}

    it('should create the first data', function(done) {

      repository.add(newData)
        .then(() => {
          expect(fsp.writeFile.calledWith('test/0.json', JSON.stringify(newData))).to.equal(true)
          done()
        })
        .catch(done)
    })

    it('should create the folder if it does not exist', function(done) {
      fs.existsSync.returns(false)

      repository.add(newData)
        .then(() => {
          expect(fs.mkdirSync.calledWith('test')).to.equal(true)
          done()
        })
        .catch(done)
    })
  })

  describe('get', function() {
    it('should read a file', function(done) {
      let simpleData = {__id: 0, stuff: 'stuff'}
      fsp.readFile.returns(Promise.resolve(JSON.stringify(simpleData)))

      repository.get(simpleData.__id)
        .then(result => {
          expect(result).to.deep.equal(simpleData)
          done()
        })
    })
  })

  describe('getAll', function() {
    it('should get an empty array when folder exists but empty', function(done) {
      fsp.readdir.returns(Promise.resolve([]))

      repository.getAll()
        .then(allData => {
          expect(allData).to.deep.equal([])
          done()
        })
        .catch(done)
    })

    it('should the existing data as a collection', function(done) {
      let existingData = [{__id: 0, stuff: 'stuff'}]
      fsp.readdir.returns(Promise.resolve(['0.json']))
      fsp.readFile.returns(Promise.resolve(JSON.stringify(existingData[0])))

      repository.getAll()
        .then(allData => {
          expect(allData).to.deep.equal(existingData)
          done()
        })
        .catch(done)
    })

    it('should get an empty collection when folder does not exist', function(done) {
      fs.existsSync.returns(false)

      repository.getAll()
        .then(allData => {
          expect(allData).to.deep.equal([])
          done()
        })
        .catch(done)
    })
  })

  describe('delete', function() {
    it('should delete a file', function(done) {
        repository.delete(0)
        .then(() => {
          expect(fsp.unlink.calledWith('test/0.json'))
          done()
        })
    })
  })

  describe('update', function() {
    it('should overwrite existing file', function(done) {
      let dataWithNewValues = {__id: 0, stuff: 'other stuff'}

      repository.update(0, dataWithNewValues)
        .then(updatedData => {
          expect(fsp.writeFile.calledWith('test/0.json', JSON.stringify(dataWithNewValues))).to.equal(true)
          done()
        })
    })
  })
})