const fs          = require('fs');
const TrackConfig = require('track-config');

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
    this._directory = dir;
    this._raws = {
      js:  fs.readFileSync(`${dir}${this._removeRelativeUrlRoot(js)}`).toString(),
      css: fs.readFileSync(`${dir}${this._removeRelativeUrlRoot(css)}`).toString(),
    };
  }

  /**
   * Get directory.
   * @return {string} directory.
   */
  get directory() {
    return this._directory;
  }

  /**
   * Get raw data.
   * @return {object} raw data.
   */
  get raws() {
    return this._raws;
  }

  /**
   * Remove relative url root.
   * @param {string} path Path.
   * @return {string} Removed relative url root path.
   */
  _removeRelativeUrlRoot(path) {
    const relativeUrlRoot = TrackConfig.relativeUrlRoot;
    if (relativeUrlRoot && path.startsWith(relativeUrlRoot)) {
      return path.slice(relativeUrlRoot.length);
    } else {
      return path;
    }
  }
}

module.exports = Asset;
