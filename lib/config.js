const XHR2 = require('xhr2');

/**
 * Config.
 */
class Config {
  /**
   * Execute function with configure.
   * @param {function} func configure function.
   */
  static configure(func) {
    func(this);
  }

  /**
   * Set browserMock.
   * @param {function} value BrowserMock (`mithril/test-utils/browserMock`).
   */
  static set browserMock(value) {
    global.window = value();
    global.window.XMLHttpRequest = XHR2;
    global.document = global.window.document;
  }

  /**
   * Set cache.
   * @param {CacheBase} value Cache.
   */
  static set cache(value) {
    this._cache = value;
  }

  /**
   * Get cache.
   * @return {CacheBase} Cache.
   */
  static get cache() {
    return this._cache;
  }
}

module.exports = Config;
