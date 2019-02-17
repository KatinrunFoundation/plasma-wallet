const axios = require('axios')
const uuidv4 = require('uuid/v4')

/**
 * Provides communication with nodes that expose a JSON-RPC interface over HTTP.
 */
class HttpProvider {
  constructor () {
    this.http = axios.create({
      baseURL: 'http://localhost:9876'
    })
  }

  async handle (method, params) {
    const rawResponse = await this.http.post('/', {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: uuidv4()
    })
    const response = JSON.parse(rawResponse.data)

    if (response.error) {
      throw new Error(response.message)
    }
    return response.result
  }
}

export default HttpProvider
