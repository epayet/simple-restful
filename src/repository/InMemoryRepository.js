export default class InMemoryRepository {
  constructor() {
    this.data = []
    this.idCounter = 0
  }

  getAll() {
    return Promise.resolve(this.data)
  }

  get(id) {
    return Promise.resolve(this.find(id))
  }

  add(newData) {
    newData.__id = this.idCounter
    this.idCounter++
    this.data.push(newData)
    return Promise.resolve(newData)
  }

  update(id, updatedData) {
    let index = this.findIndex(id)
    this.data[index] = updatedData
    return Promise.resolve()
  }

  delete(id) {
    let index = this.findIndex(id)
    this.data.splice(index)
    return Promise.resolve()
  }

  find(id) {
    return this.data.find(data => data.__id === id)
  }

  findIndex(id) {
    return this.data.findIndex(data => data.__id === id)
  }
}