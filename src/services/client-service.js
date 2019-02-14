import BrowserPlasmaClient from './plasma-client/plasma-client'

const clientOptions = {
  finalityDepth: 0,
  debug: 'service:*, debug:*, core:*',
  ethereumEndpoint: 'https://rinkeby.infura.io/v3/fce31f1fb2d54caa9b31ed7d28437fa5',
  plasmaChainName: 'PG-beta.12',
  registryAddress: '0x18d8BD44a01fb8D5f295a2B3Ab15789F26385df7'
}
const client = new BrowserPlasmaClient(clientOptions)

export default client
