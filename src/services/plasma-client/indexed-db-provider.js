import { openDb, deleteDb } from 'idb'
import { EventEmitter } from 'events'

class IndexedBProvider extends EventEmitter {
  constructor () {
    super()

    this.dbname = 'test-store'
    this.store = 'chain'
  }

  get name () {
    return 'db'
  }

  get dependencies () {
    return []
  }

  async start () {
    this.started = true
    await this._onStart()
  }

  async _onStart () {
    this.db = await this._openDb()
  }

  async _openDb () {
    return openDb(this.dbname, 1, upgradeDB => {
      upgradeDB.createObjectStore(this.store)
    })
  }

  async _deleteDb () {
    return deleteDb(this.dbname)
  }

  async get (key, fallback) {
    const exists = await this.exists(key)
    if (!exists) {
      if (arguments.length === 2) {
        return fallback
      } else {
        throw new Error('Key not found in database')
      }
    }
  
    const result = await this.db.transaction(this.store).objectStore(this.store).get(key)
    return this._isJson(result) ? JSON.parse(result) : result
  }

  async set (key, value) {
    if (!(value instanceof String || typeof value === 'string')) {
      value = JSON.stringify(value)
    }

    const tx = this.db.transaction(this.store, 'readwrite')
    tx.objectStore(this.store).put(value, key)
    await tx.complete
  }

  async delete (key) {
    const tx = this.db.transaction(this.store, 'readwrite')
    tx.objectStore(this.store).delete(key)
    return tx.complete
  }

  async exists (key) {
    const count = await this.db.transaction(this.store).objectStore(this.store).count(key)
    return count !== 0
  }

  async findNextKey (key) {
    const prefix = key.split(':')[0]
    const tx = this.db.transaction(this.store)
    let result = undefined
    tx.objectStore(this.store).iterateKeyCursor((cursor) => {
      if (result || !cursor) return
      if (cursor.key.startsWith(prefix) && cursor.key > key) {
        result = cursor.key
      }
      cursor.continue()
    })
    await tx.complete
    return result || key
  }

  async bulkPut (objects) {
    const tx = this.db.transaction(this.store, 'readwrite')
    for (const object of objects) {
      if (!(object.value instanceof String || typeof object.value === 'string')) {
        object.value = JSON.stringify(object.value)
      }
      tx.objectStore(this.store).put(object.value, object.key)
    }
    return tx.complete
  }

  /**
   * Checks if a thing is a valid JSON string.
   * @param {*} str Thing to check.
   * @return {boolean} `true` if it's a JSON string, `false` otherwise.
   */
  _isJson (str) {
    try {
      JSON.parse(str)
    } catch (err) {
      return false
    }
    return true
  }
}

export default IndexedBProvider
