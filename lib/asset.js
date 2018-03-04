const crypto = require('crypto');
const fs     = require('fs');
const path   = require('path');

/**
 * Asset data.
 */
class Asset {
  /**
   * Initialize
   * @param {string} dir Directory of assets.
   * @param {string} js  Relative file path to Javascript.
   * @param {string} css Relative file path to CSS.
   */
  constructor(dir, js, css) {
    this._raws = {
      js:  fs.readFileSync(path.resolve(dir, js)).toString(),
      css: fs.readFileSync(path.resolve(dir, css)).toString(),
    };

    this._digests = {
      js:  crypto.createHash('md5').update(this._raws.js).digest('hex'),
      css: crypto.createHash('md5').update(this._raws.css).digest('hex'),
    };

    this._serverPaths = {
      js:  `${path.resolve('/', js)}?${this._digests.js}`,
      css: `${path.resolve('/', css)}?${this._digests.css}`,
    };
  }

  /**
   * Get digests.
   * @return {object} digests.
   */
  get digests() {
    return this._digests;
  }

  /**
   * Get server paths.
   * @return {object} paths.
   */
  get serverPaths() {
    return this._serverPaths;
  }

  /**
   * Get raw data.
   * @return {object} raw data.
   */
  get raws() {
    return this._raws;
  }
}

module.exports = Asset;