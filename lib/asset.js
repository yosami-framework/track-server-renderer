const fs = require('fs');

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
      js:  fs.readFileSync(`${dir}${js}`).toString(),
      css: fs.readFileSync(`${dir}${css}`).toString(),
    };

    this._paths = {
      js:  js,
      css: css,
    };
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
  get paths() {
    return this._paths;
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
