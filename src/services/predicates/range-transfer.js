const utils = require('plasma-utils')
const web3Utils = utils.utils.web3Utils
import { AbiCoder } from 'web3-eth-abi'
import EthCrypto from 'eth-crypto'
const abi = new AbiCoder()

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const createTransaction = (typedStart, typedEnd, newdata) => {
  const parameters = abi.encodeParameters(['bytes'], [newdata])
  return abi.encodeParameters(['bytes', 'uint256', 'uint256', 'address'], [parameters, typedStart, typedEnd, ZERO_ADDRESS])
}

const createWitness = (account, typedStart, typedEnd) => {
  const message = abi.encodeParameters(['uint256', 'uint256', 'uint256'], [typedStart, typedEnd, 0])
  const messageHash = web3Utils.sha3(message)
  const sig = EthCrypto.sign(account.privateKey, messageHash)
  return abi.encodeParameters(['uint256', 'uint256', 'bytes'], [typedStart, typedEnd, sig])
}

export default {
  createTransaction,
  createWitness
}
