const PlasmaCore = require('plasma-core')
import IndexedDBProvider from './indexed-db-provider'

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
}

export default PlasmaClient
