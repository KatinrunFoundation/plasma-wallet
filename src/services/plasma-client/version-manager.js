/**
 * Returns the latest published version
 * of the app. Not necessarily the version
 * that the user is using.
 * @return {string} App version string.
 */
const getLatestPublishedVersion = () => {
  return process.env.VERSION
}

/**
 * Returns the version of the app that
 * the user is currently using.
 * Not necessarily the latest version.
 * @return {string} App version string
 */
const getCurrentVersion = () => {
  return localStorage.getItem('version')
}

/**
 * Sets the current app version.
 * @param {string} version App version string.
 */
const setCurrentVersion = (version) => {
  localStorage.setItem('version', version)
}

/**
 * Checks whether the client is using the current app version.
 * @return {boolean} `true` if client is up to date, `false` otherwise.
 */
const isUsingLatestVersion = () => {
  const latest = getLatestPublishedVersion()
  const current = getCurrentVersion()
  return latest === current
}

export default {
  getLatestPublishedVersion,
  getCurrentVersion,
  setCurrentVersion,
  isUsingLatestVersion
}
