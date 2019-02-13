import { EventEmitter } from 'events'
import PlasmaCore from 'plasma-core'
import Plasma from 'plasma-js-lib'
import IndexedDBProvider from './indexed-db-provider'
import accountStore from './account-store'
import versionManager from './version-manager'

const defaultOptions = {
  dbProvider: IndexedDBProvider,
  walletProvider: PlasmaCore.providers.WalletProviders.LocalWalletProvider,
  contractProvider: PlasmaCore.providers.ContractProviders.ContractProvider,
  operatorProvider: PlasmaCore.providers.OperatorProviders.HttpOperatorProvider
}

/**
 * Plasma Client for use in the browser.
 */
class BrowserPlasmaClient extends EventEmitter {
  constructor (options) {
    super()

    options = Object.assign({}, defaultOptions, options)

    this.core = new PlasmaCore(options)
    this.plasma = new Plasma(this.core.services.jsonrpc)
  }

  /**
   * Starts the node.
   */
  async start () {
    if (this.started) return
    this.started = true

    // Upgrade before core starts so we don't fight over the database.
    await this.handleUpgrade()

    // Start core services.
    await this.core.start()

    // Load an account or create a new one.
    this.account = accountStore.getStoredAccount() || await this.resetAccount()

    this.emit('started')
  }

  /**
   * Stops the node.
   */
  async stop () {
    this.started = false

    // Stop core services.
    await this.core.stop()

    this.emit('stopped')
  }

  /**
   * Checks if the client needs to be upgraded.
   * Wipes the entire IndexedDB database.
   * Account is stored in localStorage, so it's not wiped.
   */
  async handleUpgrade () {
    // Check if the app version is the current version.
    if (versionManager.isUsingLatestVersion()) return

    // Wipe the database.
    const db = new IndexedDBProvider()
    await db._deleteDb()

    // Update the current version.
    const latest = versionManager.getLatestPublishedVersion()
    versionManager.setCurrentVersion(latest)
  }

  /**
   * Waits for the smart contract to be initialized.
   * Resolves once the contract address has been detected
   * from the plasma chain registry.
   * @return {Promise} Promise that resolves when the contract is ready.
   */
  async waitForContractInit () {
    return this.core.services.contract.waitForInit()
  }

  /**
   * Creates a new account.
   * @return {Account} An Ethereum account.
   */
  async createAccount () {
    const address = await this.core.services.wallet.createAccount()
    const account = await this.core.services.wallet._getAccount(address)
    return account
  }

  /**
   * Stores an account in database.
   * Overwrites the existing account.
   * @param {Account} account Account to store be stored.
   */
  async storeAccount (account) {
    accountStore.setStoredAccount(account)
    await this.core.services.db.set('accounts', [account.address])
    await this.core.services.db.set(`keystore:${account.address}`, account)
    this.account = account
  }

  /**
   * Burns the private user's key.
   * Overwrites the old key with a new one.
   */
  async resetAccount () {
    const account = await this.createAccount()
    await this.storeAccount(account)
    return account
  }

  /**
   * Returns the current account.
   * @return {Account} Current account object.
   */
  getAccount() {
    return this.account
  }

  // TODO: Make these RPC calls in core.
  async getLastSyncedBlock () {
    return this.core.services.chaindb.getLatestBlock()
  }

  async getEthBalance (address) {
    return this.core.services.web3.eth.getBalance(address)
  }
  
  async getCurrentEthBlock () {
    return this.core.services.web3.eth.getBlockNumber()
  }
}

export default BrowserPlasmaClient
