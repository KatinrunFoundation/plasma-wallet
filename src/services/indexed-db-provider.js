const { openDb } = require('idb')
const AsyncLock = require('async-lock')

class IndexedBProvider {
  constructor () {
    this.lock = new AsyncLock()
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
      upgradeDB.createObjectStore(this.store);
    })
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
  
    const result = await this.db.transaction(this.store).objectStore(this.store).get(key);
    return this._isJson(result) ? JSON.parse(result) : result
  }

  async set (key, value) {
    if (!(value instanceof String || typeof value === 'string')) {
      value = JSON.stringify(value)
    }

    return this.lock.acquire(key, () => {
      const tx = this.db.transaction(this.store, 'readwrite');
      tx.objectStore(this.store).put(value, key);
      return tx.complete;
    })
  }

  async delete (key) {
    return this.lock.acquire(key, () => {
      const tx = this.db.transaction(this.store, 'readwrite');
      tx.objectStore(this.store).delete(key);
      return tx.complete;
    })
  }

  async exists (key) {
    const count = await this.db.transaction(this.store).objectStore(this.store).count(key);
    return count !== 0
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
