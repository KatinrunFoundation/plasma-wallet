import HttpProvider from './http-provider'

class OperatorClient {
  constructor () {
    this.provider = new HttpProvider()
  }

  async sendTransaction (transaction, witness) {
    return this.provider.handle('op_sendTransaction', [transaction, witness])
  }

  async init (address) {
    return this.provider.handle('op_init', [address])
  }

  async getOwnedRanges (address) {
    return this.provider.handle('op_getOwnedRanges', [address])
  }

  async openChannel (address1, address2, amount) {
    return this.provider.handle('op_openChannel', [address1, address2, amount])
  }

  async getOpenChannels (address) {
    return this.provider.handle('op_getOpenChannels', [address])
  }

  async sendChannelAmount (from, to, amount) {
    return this.provider.handle('op_sendChannelAmount', [from, to, amount])
  }
}

const operator = new OperatorClient()
export default operator
