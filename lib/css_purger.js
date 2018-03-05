const Cheerio = require('cheerio');
const CSSTree = require('css-tree');

const REG_PSEUDO              = /:[^.>\s,]+/g;
const REG_REGEX_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;

/**
 * CSS purger.
 */
class CSSPurger {
  /**
   * Initialize.
   * @note This method must not call. Use `CSSPurger.purge`
   * @param {string} css  CSS
   * @param {string} html HTML
   */
  constructor(css, html) {
    this._dom = Cheerio.load(html);
    this._css = CSSTree.parse(css);
    this._ignoreRegexList = [];
  }

  /**
   * Purge CSS.
   * @note This method must not call. Use `CSSPurger.purge`
   * @return {string} purged css.
   */
  purge() {
    CSSTree.walk(this._css, {visit: 'Rule', enter: this._removeUnuseRule.bind(this)});
    CSSTree.walk(this._css, {visit: 'Atrule', enter: this._removeUnuseAtrule.bind(this)});

    return CSSTree.generate(this._css);
  }

  /**
   * Remove unuse rule.
   * @param {Rule} node Rule node.
   * @param {Item} item Rule item.
   * @param {List} list List containing rule.
   */
  _removeUnuseRule(node, item, list) {
    CSSTree.walk(node, {visit: 'Selector', enter: this._removeUnuseSelector.bind(this)});

    const selector = CSSTree.generate(node.prelude).replace(REG_PSEUDO, '');

    // @note Skip when CSS animation.
    if (selector == 'from' || selector == 'to' || selector.indexOf('%') != -1) {
      return;
    }

    if (!selector) {
      list.remove(item);
      return;
    }

    if (this._dom(selector).length == 0) {
      list.remove(item);

      const selectors = selector.split(' ');
      for (let i = 0; i < selectors.length; ++i) {
        const part = selectors.slice(0, i + 1).join(' ');
        if (this._dom(part).length == 0) {
          this._ignoreRegexList.push(new RegExp(`^${part.replace(REG_REGEX_SPECIAL_CHARS, '\\$&')}(\\.|\\s|$)`));
          return;
        }
      }
    }
  }

  /**
   * Remove unuse selector.
   * @param {Selector} node Selector node.
   * @param {Item}     item Selector item.
   * @param {List}     list List containing selector.
   */
  _removeUnuseSelector(node, item, list) {
    const selector = CSSTree.generate(node).replace(REG_PSEUDO, '');

    for (const regex of this._ignoreRegexList) {
      if (regex.test(selector)) {
        list.remove(item);
        return;
      }
    }
  }

  /**
   * Remove unuse at-rule.
   * @param {Atrule} node Atrule node.
   * @param {Item}   item Atrule item.
   * @param {List}   list List containing at-rule.
   */
  _removeUnuseAtrule(node, item, list) {
    if (node.block.children.getSize() == 0) {
      list.remove(item);
    }
  }

  /**
   * Purge CSS.
   * @param {string} css  CSS
   * @param {string} html HTML
   * @return {string} purged css.
   */
  static purge(css, html) {
    return (new CSSPurger(css, html)).purge();
  }
}

module.exports = CSSPurger;
