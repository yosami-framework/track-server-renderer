/**
 * Cache base class.
 * @abstract
 */
class CacheBase {
  /**
   * Get cache data.
   * @abstract
   * @param {string} key Cache key.
   * @return {object} Value. (null if is not existed)
   */
  get(key) {
    return null;
  }

  /**
   * Set cache data.
   * @abstract
   * @param {string} key Cache key.
   * @param {object} value Value.
   */
  set(key, value) {
  }
}

module.exports = CacheBase;
