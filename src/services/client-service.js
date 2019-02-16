import BrowserPlasmaClient from './plasma-client/plasma-client'
import settingsStore from './plasma-client/settings-store'

const settings = settingsStore.loadSettings()
const clientOptions = {
  ...settings,
  ...{
    finalityDepth: 0,
    debug: 'service:*, debug:*, core:*'
  }
}
const client = new BrowserPlasmaClient(clientOptions)

export default client
