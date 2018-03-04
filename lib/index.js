const Cheerio      = require('cheerio');
const HtmlMinifier = require('html-minifier');
const Postcss      = require('postcss');
const toHTML       = require('mithril-node-render');
const TrackConfig  = require('track-config');

/**
 * Application renderer.
 */
class TrackServerRenderer {
  /**
   * Initialize rendrer.
   * @param {TrackController} controller Controller.
   * @param {Asset}           asset      Asset.
   */
  constructor(controller, asset) {
    this._asset = asset;
    this._controller = controller;

    this._createVnode = this._createVnode.bind(this);
    this._embedCSS = this._embedCSS.bind(this);
  }

  /**
   * Render HTML.
   * @param {Request} request Request data.
   * @return {Promise} Rendering promise.
   */
  render(request) {
    return Promise.resolve(request)
      .then(this._createVnode)
      .then(toHTML)
      .then(this._embedCSS)
      .then(this._minifyHTML);
  }

  /**
   * Create vnode.
   * @param {Request} request Request data.
   * @return {vnode} vnode.
   */
   _createVnode(request) {
     const params = request.params;
     const url    = request.url;

     return this._controller.render(
       TrackConfig.m(this._controller.onmatch(params, url) || 'div', {
         'X-SERVER-PARAMS': params,
         'X-SERVER-URL':    url,
         'X-SERVER-ASSETS': this._asset.serverPaths,
       })
     );
   }

   /**
    * Inline CSS.
    * @param {string} html HTML.
    * @return {string} html HTML.
    */
   _embedCSS(html) {
     const css = Postcss.parse(this._asset.raws.css);
     const dom = Cheerio.load(html);

     css.walk(function(node) {
       if (node.type !== 'rule' || /%/.test(node.selector)) {
         return;
       }

       if (dom(node.selector.replace(/:[^.>\s,]+/g, '')).length === 0) {
         node.remove();
       }
     });

     css.walkAtRules(function(rule) {
       if (typeof rule.nodes === 'undefined' || rule.nodes.length === 0) {
         rule.remove();
       }
     });

     const styleTag = [
       '<style id="preload-css">',
       css.toString().replace(/<\/style>/g, '&lt;/style&gt;'),
       '</style>',
     ].join('');

     return html.replace('</head>', `${styleTag}</head>`);
   }

   /**
    * Minify HTML.
    * @param {string} html HTML.
    * @return {string} html HTML.
    */
   _minifyHTML(html) {
     return HtmlMinifier.minify(html, {
       collapseWhitespace:    true,
       removeAttributeQuotes: true,
       removeComments:        true,
     });
   }
}

module.exports = TrackServerRenderer;
