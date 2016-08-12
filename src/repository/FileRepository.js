import fs from 'fs-promise'

export default class FileRepository {
  constructor(options) {
    this.folderPath = options.folderPath
    this.idCounter = 0
  }

  add(newData) {
    newData.__id = this.idCounter
    this.idCounter++;
    return fs.writeFile(`${this.folderPath}/${newData.__id}.json`, JSON.stringify(newData))
      .then(() => newData)
  }
}