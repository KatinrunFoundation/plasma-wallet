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


const defaultOptions = {
  dbProvider: IndexedDBProvider,
  walletProvider: PlasmaCore.providers.WalletProviders.LocalWalletProvider,
  contractProvider: PlasmaCore.providers.ContractProviders.ContractProvider,
  operatorProvider: PlasmaCore.providers.OperatorProviders.HttpOperatorProvider,
  plasmaChainName: 'PG-beta.11',
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
    await this.core.start()
  }

  /**
   * Stops the node.
   */
  async stop () {
    this.started = false
    await this.core.stop()
  }

  async getAddress() {
    if (this.address) return this.address

    const accounts = await this.core.services.wallet.getAccounts()
    if (accounts.length === 0) {
      const account = await this.core.services.wallet.createAccount()
      accounts.push(account)
    }
    this.address = accounts[0]
    return accounts[0]
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
}

const clientOptions = {
  finalityDepth: 0,
  debug: 'service:*',
  ethereumEndpoint: 'https://rinkeby.infura.io/v3/fce31f1fb2d54caa9b31ed7d28437fa5',
}
const client = new PlasmaClient(clientOptions)

export default client
