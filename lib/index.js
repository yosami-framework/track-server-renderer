const HtmlMinifier = require('html-minifier');
const m            = require('mithril');
const toHTML       = require('mithril-node-render');
const TrackConfig  = require('track-config');
const Config       = require('./config');
const CSSPurger    = require('./css_purger');
const Digest       = require('./digest');

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
    const locale    = TrackConfig.localeSelector(request.url);
    const cacheKey  = Digest.md5(`${locale}:${request.url}`);
    const cacheData = Config.cache.get(cacheKey);

    if (cacheData) {
      return Promise.resolve(cacheData);
    } else {
      return Promise.resolve(request)
        .then(this._createVnode)
        .then(toHTML)
        .then(this._embedCSS)
        .then(this._minifyHTML)
        .then(function(html) {
          Config.cache.set(cacheKey, html);
          return html;
        });
    }
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
       m(this._controller.onmatch(params, url) || 'div', {
         'X-SERVER-PARAMS': params,
         'X-SERVER-URL':    url,
       })
     );
   }

   /**
    * Inline CSS.
    * @param {string} html HTML.
    * @return {string} html HTML.
    */
   _embedCSS(html) {
     const css = CSSPurger.purge(this._asset.raws.css, html);

     const styleTag = [
       '<style id="preload-css">',
       css.replace(/<\/style>/g, '&lt;/style&gt;'),
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
