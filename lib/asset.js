const fs     = require('fs');
const path   = require('path');
const Digest = require('./digest');

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
    this._dir = dir;

    this._raws = {
      js:  fs.readFileSync(path.resolve(dir, js)).toString(),
      css: fs.readFileSync(path.resolve(dir, css)).toString(),
    };

    this._digests = {
      js:  Digest.md5(this._raws.js),
      css: Digest.md5(this._raws.css),
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
   * Get directory.
   * @return {string} directory.
   */
  get directory() {
    return this._dir;
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
