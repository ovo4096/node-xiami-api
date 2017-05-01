const _id = new WeakMap()
const _name = new WeakMap()
const _artistId = new WeakMap()
const _songIds = new WeakMap()
const _coverURL = new WeakMap()
const _description = new WeakMap()

class Album {
  constructor ({
    id = null,
    name = null,
    artistId = null,
    songIds = null,
    coverURL = null,
    description = null
  } = {}) {
    _id.set(this, id)
    _name.set(this, name)
    _artistId.set(this, artistId)
    _songIds.set(this, songIds)
    _coverURL.set(this, coverURL)
    _description.set(this, description)
  }

  get id () {
    return _id.get(this)
  }

  get name () {
    return _name.get(this)
  }

  get artistId () {
    return _artistId.get(this)
  }

  get songIds () {
    return _songIds.get(this)
  }

  get coverURL () {
    return _coverURL.get(this)
  }

  get description () {
    return _description.get(this)
  }
}

module.exports = Album
