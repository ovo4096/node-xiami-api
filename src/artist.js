class Artist {
  constructor ({
    id = null,
    name = null,
    alias = null,
    description = null,
    photoURL = null,
    albums = null,
    top100Songs = null
  }) {
    this._id = id
    this._name = name
    this._alias = alias
    this._photoURL = photoURL
    this._description = description
    this._albums = albums
    this._top100Songs = top100Songs
  }

  get id () {
    return this._id
  }

  get name () {
    return this._name
  }

  get alias () {
    return this._alias
  }

  get description () {
    return this._description
  }

  get photoURL () {
    return this._photoURL
  }

  get albums () {
    return this._albums
  }

  get top100Songs () {
    return this._top100Songs
  }

  static get (id) {
    return util.getArtist(id)
  }
}

module.exports = Artist

const util = require('./util')
