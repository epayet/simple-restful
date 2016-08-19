import fsp from 'fs-promise'
import fs from 'fs'

export default class FileRepository {
  constructor(options = {}) {
    if(!options.folderPath) {
      throw new Error('repositoryOptions.folderPath is undefined')
    }
    this.folderPath = options.folderPath
    this.idCounter = 0
  }

  add(newData) {
    if (!fs.existsSync(this.folderPath)){
      fs.mkdirSync(this.folderPath);
    }

    newData.__id = this.idCounter
    this.idCounter++;
    return fsp.writeFile(this._getPath(newData.__id), JSON.stringify(newData))
      .then(() => newData)
  }

  get(id) {
    return fsp.readFile(this._getPath(id), 'utf-8')
      .then(stringData => JSON.parse(stringData))
  }

  getAll() {
    if (!fs.existsSync(this.folderPath)){
      return Promise.resolve([])
    }

    return fsp.readdir(this.folderPath)
      .then(files => {
        let promises = []
        for(let fileName of files) {
          promises.push(this.get(fileName.split('.')[0]))
        }
        return Promise.all(promises)
      })
  }

  delete(id) {
    return fsp.unlink(this._getPath(id))
  }

  update(id, newData) {
    return fsp.writeFile(this._getPath(id), JSON.stringify(newData))
      .then(() => newData)
  }

  _getPath(id) {
    return `${this.folderPath}/${id}.json`
  }
}