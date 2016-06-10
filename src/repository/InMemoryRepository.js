export default class InMemoryRepository {
  constructor() {
    this.data = []
    this.idCounter = 0
  }

  getAll() {
    return Promise.resolve(this.data)
  }

  get(id) {
    return Promise.resolve(this.data.find(data => data.__id === id))
  }

  add(newData) {
    newData.__id = this.idCounter
    this.idCounter++
    this.data.push(newData)
    return Promise.resolve(newData)
  }

  update(updatedData) {

  }

  delete(id) {

  }
}