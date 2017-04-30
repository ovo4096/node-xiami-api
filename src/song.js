const _id = new WeakMap()
const _name = new WeakMap()
const _albumId = new WeakMap()
const _artistIds = new WeakMap()

class Song {
  constructor ({ id, name, albumId, artistIds }) {
    _id.set(this, id)
    _name.set(this, name)
    _albumId.set(this, albumId)
    _artistIds.set(this, artistIds)
  }
  get id () {
    return _id.get(this)
  }

  get name () {
    return _name.get(this)
  }

  get albumId () {
    return _albumId.get(this)
  }

  get artistIds () {
    return _artistIds.get(this)
  }
}

module.exports = Song
