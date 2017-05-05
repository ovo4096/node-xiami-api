class PaginationLazyLoadCollection {
  constructor (getter, paginationGetter, perPage) {
    this._getter = getter
    this._paginationGetter = paginationGetter
    this._perPage = perPage
    this._ids = []
  }

  get (index) {
    return this._getAndFillIds(index)
  }

  _getAndFillIds (index, onlyFillIds = false) {
    return new Promise((resolve, reject) => {
      if (index < 0 && index) {
        reject(new Error('Index is out of bounds'))
        return
      }

      if (this._length !== undefined && index >= this._length) {
        resolve(null)
        return
      }

      if (this._ids[index] === undefined) {
        const page = Math.ceil((index + 1) / this._perPage)
        this._paginationGetter(page).then(({ ids, total }) => {
          if (this._length === undefined) {
            this._length = total
          }
          for (let i = 0; i < this._perPage; i++) {
            const ii = (page - 1) * this._perPage + i
            if (ii >= this._length) break
            this._ids[ii] = ids[i]
          }

          if (onlyFillIds) {
            resolve(null)
            return
          }

          this.get(index).then((value) => {
            resolve(value)
          }).catch((e) => {
            reject(e)
          })
        }).catch((e) => {
          reject(e)
        })
        return
      }

      this._getter(this._ids[index]).then((value) => {
        resolve(value)
      }).catch((e) => {
        reject(e)
      })
    })
  }

  get length () {
    return this._length
  }

  get all () {
    return new Promise((resolve, reject) => {
      this._slice().then(() => {
        const getAllValues = []
        for (const id of this._ids) {
          getAllValues.push(this._getter(id))
        }
        Promise.all(getAllValues).then((values) => {
          resolve(values)
        }).catch((e) => {
          reject(e)
        })
      }).catch((e) => {
        reject(e)
      })
    })
  }

  _slice (begin, end) {
    end = (typeof end !== 'undefined') ? end : this._length
    let size
    const len = this.length

    let start = begin || 0
    start = (start >= 0) ? start : len + start

    let upTo = (end) || len
    if (end < 0) {
      upTo = len + end
    }

    size = upTo - start

    const fillIds = []

    if (size > 0) {
      const startPage = Math.ceil((start + 1) / this._perPage)
      const endPage = Math.ceil((start + size) / this._perPage)
      for (let i = startPage; i <= endPage; i++) {
        if (this._ids[i * this._perPage - this._perPage] === undefined) {
          fillIds.push(this._getAndFillIds(i * this._perPage - this._perPage, true))
        }
      }
    }

    return Promise.all(fillIds)
  }

  slice (start, end) {
    return new Promise((resolve, reject) => {
      this._slice(start, end).then(() => {
        const sliceIds = this._ids.slice(start, end)
        const getValues = []
        for (const id of sliceIds) {
          getValues.push(this._getter(id))
        }
        Promise.all(getValues).then((values) => {
          resolve(values)
        }).catch((e) => {
          reject(e)
        })
      }).catch((e) => {
        reject(e)
      })
    })
  }

  static create (getter, paginationGetter, perPage) {
    const pllc = new PaginationLazyLoadCollection(getter, paginationGetter, perPage)
    return new Promise((resolve, reject) => {
      pllc.get(0).then(() => {
        resolve(pllc)
      }).catch((e) => {
        reject(e)
      })
    })
  }
}

module.exports = PaginationLazyLoadCollection
