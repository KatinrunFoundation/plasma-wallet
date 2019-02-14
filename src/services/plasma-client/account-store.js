/**
 * Loads the stored account.
 * @return {Account} The stored account.
 */
const getStoredAccount = () => {
  let account
  try {
    account = JSON.parse(localStorage.getItem('account'))
  } catch (err) {
    account = undefined
  }
  return account
}

/**
 * Stores a new account.
 * @param {Account} account Account to store.
 */
const setStoredAccount = (account) => {
  localStorage.setItem('account', JSON.stringify(account))
}

/**
 * Removes the stored account.
 */
const removeStoredAccount = () => {
  localStorage.removeItem('account')
}

/**
 * Checks whether there's a stored account.
 * @return {boolean} `true` if there's a stored account, `false` otherwise.
 */
const hasStoredAccount = () => {
  const account = getStoredAccount()
  return account !== undefined
}

export default {
  getStoredAccount,
  setStoredAccount,
  removeStoredAccount,
  hasStoredAccount
}
