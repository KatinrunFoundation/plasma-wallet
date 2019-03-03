const defaultSettings = {
  ethereumEndpoint: 'https://rinkeby.infura.io/v3/fce31f1fb2d54caa9b31ed7d28437fa5',
  plasmaChainName: 'Katinrun-plasma-mark1',
  registryAddress: '0x18d8BD44a01fb8D5f295a2B3Ab15789F26385df7'
}

const loadSettings = () => {
  let settings
  try {
    settings = JSON.parse(localStorage.getItem('settings'))
  } finally {
    settings = settings || defaultSettings
  }
  return settings
}

const saveSettings = (settings) => {
  localStorage.setItem('settings', JSON.stringify(settings))
}

export default {
  loadSettings,
  saveSettings,
  defaultSettings
}
