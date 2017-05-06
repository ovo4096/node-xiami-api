class LazyLoadCollection {
  constructor (getter, ids) {
    this._ids = ids
    this._getter = getter
  }

  get (index) {
    if (this._ids[index] === undefined) {
      return new Promise((resolve, reject) => { resolve(null) })
    }
    return this._getter(this._ids[index])
  }

  get length () {
    return this._ids.length
  }

  getAll () {
    return Promise.all([...this])
  }

  slice (begin, end) {
    return Promise.all([...new LazyLoadCollection(this._getter, this._ids.slice(begin, end))])
  }

  * [Symbol.iterator] () {
    for (const id of this._ids) {
      yield this._getter(id)
    }
  }
}

module.exports = LazyLoadCollection
