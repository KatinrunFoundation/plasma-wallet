const PlasmaCore = require('plasma-core')
const utils = require('plasma-utils')
const models = utils.serialization.models
const UnsignedTransaction = models.UnsignedTransaction
import BigNum from 'bn.js'
import IndexedDBProvider from './indexed-db-provider'

const TOKENS = {
  '0': 'ETH'
}

/**
 * Converts a value to a hex string.
 * @param {*} value Value to convert.
 * @return {string} Value as a hex string.
 */
const toHexString = (value) => {
  return new BigNum(value).toString('hex')
}

const resetDb = async () => {
  const db = new IndexedDBProvider()
  await db._deleteDb()
}

const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const defaultOptions = {
  dbProvider: IndexedDBProvider,
  walletProvider: PlasmaCore.providers.WalletProviders.LocalWalletProvider,
  contractProvider: PlasmaCore.providers.ContractProviders.ContractProvider,
  operatorProvider: PlasmaCore.providers.OperatorProviders.HttpOperatorProvider,
  plasmaChainName: 'PG-beta.12',
  registryAddress: '0x18d8BD44a01fb8D5f295a2B3Ab15789F26385df7'
}

class PlasmaClient {
  constructor (options) {
    options = Object.assign({}, defaultOptions, options)

    this.core = new PlasmaCore(options)
  }

  /**
   * Starts the node.
   */
  async start () {
    if (this.started) return
    this.started = true
    await this.handleUpgrade()
    await this.core.start()
  }

  /**
   * Stops the node.
   */
  async stop () {
    this.started = false
    await this.core.stop()
  }

  async handleUpgrade () {
    const latest = process.env.VERSION
    const current = localStorage.getItem('version')
    if (current === latest) return

    const account = this.getStoredAccount()
    await resetDb()
    if (account) {
      this.setStoredAccount(account)
    }
    localStorage.setItem('version', latest)
  }

  getStoredAccount () {
    let account
    try {
      account = JSON.parse(localStorage.getItem('account'))
    } catch (err) {
      account = undefined
    }
    return account
  }

  setStoredAccount (account) {
    localStorage.setItem('account', JSON.stringify(account))
  }

  async waitForContractInit () {
    await this.core.services.contract.waitForInit()
  }

  async getAddress() {
    if (this.address) return this.address

    let account = this.getStoredAccount()
    if (!account) {
      const address = await this.core.services.wallet.createAccount()
      account = await this.core.services.wallet._getAccount(address)
      this.setStoredAccount(account)
    } else {
      await this.core.services.db.set('accounts', [account])
      await this.core.services.db.set(`keystore:${account.address}`, account)
    }

    this.address = account.address
    return this.address
  }

  async getBalances(address) {
    const balances = await this.core.services.chain.getBalances(address)
    const parsed = []
    for (const token in balances) {
      const tokenName = TOKENS[token] || token
      parsed.push({
        id: token,
        token: tokenName,
        balance: balances[token].toString()
      })
    }
    return parsed
  }

  async waitForAddress () {
    while (!this.address) {
      await sleep(100)
    }
    return this.address
  }

  async getCurrentBlock () {
    return this.core.services.contract.getCurrentBlock()
  }

  async getLastSyncedBlock () {
    return this.core.services.chaindb.getLatestBlock()
  }

  async getEthBalance (address) {
    return this.core.services.web3.eth.getBalance(address)
  }

  async sendTransaction (from, to, token, amount) {
    token = toHexString(token)
    amount = toHexString(amount)

    const ranges = await this.core.services.chain.pickRanges(from, token, amount)
    const nextBlock = await this.core.services.operator.getNextBlock()
    const transaction = {
      block: nextBlock,
      transfers: ranges.map((range) => {
        return {
          ...range,
          ...{ sender: from, recipient: to }
        }
      })
    }
    const hash = new UnsignedTransaction(transaction).hash
    const signature = await this.core.services.wallet.sign(from, hash)
    transaction.signatures = ranges.map(() => {
      return signature
    })
    return this.core.services.chain.sendTransaction(transaction)
  }

  async deposit (address, token, amount) {
    token = toHexString(token)
    amount = toHexString(amount)

    return this.core.services.contract.deposit(token, amount, address)
  }

  async exit (address, token, amount) {
    token = toHexString(token)
    amount = toHexString(amount)

    return this.core.services.chain.startExit(address, token, amount)
  }

  async finalizeExits (address) {
    return this.core.services.chain.finalizeExits(address)
  }

  async getExits (address) {
    const exits = await this.core.services.chain.getExitsWithStatus(address)
    for (const exit of exits) {
      exit.tokenName = TOKENS[exit.token] || exit.token
    }
    return exits
  }

  async getCurrentEthBlock () {
    return this.core.services.web3.eth.getBlockNumber()
  }

  async getPrivateKey (address) {
    const account = await this.core.services.wallet._getAccount(address)
    return account.privateKey
  }

  async burn () {
    localStorage.removeItem('account')
    await this.core.services.db.delete('accounts')
    await this.core.services.db.delete(`keystore:${this.address}`)
    this.address = undefined
  }
}

const clientOptions = {
  finalityDepth: 0,
  debug: 'service:*, debug:*, core:*',
  ethereumEndpoint: 'https://rinkeby.infura.io/v3/fce31f1fb2d54caa9b31ed7d28437fa5',
}
const client = new PlasmaClient(clientOptions)

export default client
