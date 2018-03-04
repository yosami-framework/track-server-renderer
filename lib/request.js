/**
 * Request data.
 */
class Request {
  /**
   * Initialize
   * @param {string} url    Request URL.
   * @param {object} params Parameters.
   */
  constructor(url, params) {
    this._url = url;
    this._params = params;
  }

  /**
   * Get url.
   * @return {string} url.
   */
  get url() {
    return this._url;
  }

  /**
   * Get params.
   * @return {object} params.
   */
  get params() {
    return this._params;
  }
}

module.exports = Request;
