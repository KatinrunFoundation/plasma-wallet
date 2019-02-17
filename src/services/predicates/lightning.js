import { AbiCoder } from 'web3-eth-abi'
const abi = new AbiCoder()

const createMultiSigScript = (address1, address2) => {
  return {
    sigil: '02',
    value: '000000000000000000000000000000000000000000000000000000000000ffff',
    script: address1.slice(2).toLowerCase() + address2.slice(2).toLowerCase(),
    inputsHash: '0000000000000000000000000000000000000000000000000000000000000000',
    inputIndex: '0000000000000000000000000000000000000000000000000000000000000000'
  }
}

const encodeScript = (script) => {
  return '0x' + script.value + script.sigil + script.script + script.inputsHash + script.inputIndex
}

const getPredicateData = (address1, address2) => {
  const multiSigScript = createMultiSigScript(address1, address2)
  const encodedScript = encodeScript(multiSigScript)
  return abi.encodeParameters(['bytes[]'], [[encodedScript]])
}

export default {
  getPredicateData
}
