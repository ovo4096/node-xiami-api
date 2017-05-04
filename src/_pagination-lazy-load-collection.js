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

  _getAndFillIds (index, fillIds = false) {
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
          console.log('tick')
          if (this._length === undefined) {
            this._length = total
          }
          for (let i = 0; i < this._perPage; i++) {
            const ii = (page - 1) * this._perPage + i
            if (ii >= this._length) break
            this._ids[ii] = ids[i]
          }

          if (fillIds) {
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
      this._fillAllIds().then(() => {
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

  _fillAllIds () {
    const totalPage = Math.ceil(this._length / this._perPage)
    const getAllIds = []

    console.log(totalPage)

    for (let i = 1; i <= totalPage; i++) {
      if (this._ids[i * this._perPage - this._perPage] === undefined) {
        getAllIds.push(this._getAndFillIds(i * this._perPage - this._perPage, true))
      }
    }
    return Promise.all(getAllIds)
  }

  slice (begin, end) {
    return new Promise((resolve, reject) => {
      this._fillAllIds().then(() => {
        const sliceIds = this._ids.slice(begin, end)
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
