import client from './client-service'
import operator from './operator/operator'
import BigNum from 'bn.js'

/**
 * "Sleeps" for a given period of time.
 * @param {number} ms Milliseconds to sleep.
 * @return {Promise} Promise that resolves after `ms` milliseconds.
 */
const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Runs an async function in a loop, synchronously.
 * Sleeps for a pre-defined period of time between each loop.
 * @param {Function} fn Function to run each loop.
 * @param {number} ms Milliseconds to sleep between loops.
 */
const syncInterval = async (fn, ms) => {
  try {
    await fn()
  } finally {
    await sleep(ms)
    syncInterval(fn, ms)
  }
}

const TOKENS = {
  '0': 'ETH',
  '1': 'TORCH'
}

/**
 * Service that automatically watches updates in client data.
 */
class ClientDataService {
  constructor () {
    this.account = {}
    this.ethBalance = '0'
    this.balances = []
    this.exits = []
    this.currentEthBlock = 0
    this.syncing = true
    this.watching = false
    this.channel = undefined
  }

  /**
   * Forces the client to refresh all values.
   */
  async forceRefresh () {
    this.account = await client.getAccount()
    await this._slowWatchCheck()
    await this._fastWatchCheck()
  }

  /**
   * Starts watching for changes in the client.
   */
  async watch () {
    if (this.watching) return
    this.watching = true

    client.core.services.contract.on('initialized', () => {
      this._startWatchIntervals()
    })

    // Initial setup.
    await client.start()
    this.account = await client.getAccount()
    await operator.init(this.account.address)
  }

  /**
   * Starts all watch intervals.
   */
  async _startWatchIntervals () {
    syncInterval(this._fastWatchCheck.bind(this), 1000)
    syncInterval(this._slowWatchCheck.bind(this), 10000)
  }

  /**
   * Series of checks triggered occasionally.
   */
  async _slowWatchCheck () {
    // this.ethBalance = await client.plasma.getEthBalance(this.account.address)
    // this.currentEthBlock = await client.plasma.getCurrentEthBlock()
    // await this._getExits()
    await this._getBalances()
    await this._getChannels()
  }

  /**
   * Series of checks triggered frequently.
   */
  async _fastWatchCheck () {
    this.account = await client.getAccount()
    await this._getSyncStatus()
    // await client.plasma.finalizeExits(this.account.address)
  }

  /**
   * Queries the current synchronization status.
   */
  async _getSyncStatus () {
    const currentBlock = await client.plasma.getCurrentBlock()
    const lastSyncedBlock = await client.plasma.getLastSyncedBlock()
    this.syncing = currentBlock !== lastSyncedBlock
  }

  /**
   * Queries and parses the user's balances.
   */
  async _getBalances () {
    const ownedRanges = await operator.getOwnedRanges(this.account.address)
    let sum = 0;
    for (const range of ownedRanges) {
      sum += (range.typedEnd - range.typedStart)
    }

    const balances = [
      {
        id: '0',
        token: 'ETH',
        balance: new BigNum(sum)
      }
    ]

    this.balances = balances
  }

  async _getChannels () {
    const openChannel = await operator.getOpenChannels(this.account.address)
    this.channel = openChannel
  }

  /**
   * Queries and parses the user's exits.
   */
  async _getExits () {
    let exits = await client.plasma.getExits(this.account.address)
    
    // Get rid of any finalized exits.
    exits = exits.filter((exit) => {
      return !exit.finalized
    })

    // Add some additional data.
    for (const exit of exits) {
      const blocksLeft = Math.max((exit.block.toNumber() + 20) - this.currentEthBlock, 0)
      const timeLeft = blocksLeft * 15
      const minutes = Math.floor(timeLeft / 60)
      exit.timeLeft = minutes >= 1 ? `~ ${minutes} minutes` : '<1 minute'
      exit.tokenName = TOKENS[exit.token] || exit.token
    }

    this.exits = exits
  }
}

const clientData = new ClientDataService()
clientData.watch()

export default clientData
