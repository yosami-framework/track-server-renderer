const crypto = require('crypto');

/**
 * Digest.
 */
class Digest {
  /**
   * Get MD5 hexdigest.
   * @param {string} value value.
   * @return {string} MD5 hexdigest.
   */
  static md5(value) {
    return crypto.createHash('md5').update(value).digest('hex');
  }
}

module.exports = Digest;
