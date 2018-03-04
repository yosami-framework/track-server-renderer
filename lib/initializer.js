const XHR2 = require('xhr2');

/**
 * Initializer.
 */
class Initializer {
  /**
   * Initialize rendering environment.
   * @param {function} browserMock Mock (`mithril/test-utils/browserMock`).
   */
  static initialize(browserMock) {
    global.window = browserMock();
    global.window.XMLHttpRequest = XHR2;
    global.document = window.document;
  }
}

module.exports = Initializer;
