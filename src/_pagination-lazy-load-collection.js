class PaginationLazyLoadCollection {
  constructor (getter, paginationGetter, perPage) {
    this._getter = getter
    this._paginationGetter = paginationGetter
    this._perPage = perPage
    this._ids = []
  }

  get (index) {
    if (this._ids[index] === undefined) {
      return new Promise((resolve, reject) => {
        if (index < 0 && index) {
          reject(new Error('Index is out of bounds'))
          return
        }
        const page = Math.ceil((index + 1) / this._perPage)
        this._paginationGetter(page).then((ids) => {
          for (let i = 0; i < this._perPage; i++) {
            const ii = (page - 1) * this._perPage + i
            if (ii >= this._length) break
            this._ids[ii] = ids[i] === undefined ? null : ids[i]
          }
          this.get(index).then((value) => {
            resolve(value)
          }).catch((e) => {
            reject(e)
          })
        }).catch((e) => {
          reject(e)
        })
      })
    } else if (this._ids[index] === null) {
      return new Promise((resolve, reject) => {
        resolve(null)
      })
    }
    return this._getter(this._ids[index])
  }

  get length () {
    return this._length
  }

  get all () {
  }
}

module.exports = PaginationLazyLoadCollection
