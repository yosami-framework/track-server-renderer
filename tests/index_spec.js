require('./spec_helper');
const t                   = require('track-spec');
const Cheerio             = require('cheerio');
const TrackController     = require('track-controller');
const path                = require('path');
const Asset               = require('../lib/asset');
const Config              = require('../lib/config');
const Request             = require('../lib/request');
const TrackServerRenderer = require('../lib/index');

t.describe('TrackServerRenderer', () => {
  let asset          = null;
  let renderer       = null;
  let MockController = null;

  t.beforeEach(() => {
    MockController = (class extends TrackController {
      /**
       * Definitions of model.
       */
      static definer() {
        name('mock_controller');
        views('mock');
      }
    });

    const assetsDir = path.resolve(__dirname, 'fixtures');
    asset = new Asset(assetsDir, '/assets/mock.js', '/assets/mock.css');
    renderer = new TrackServerRenderer(MockController, asset);
  });

  t.describe('#render', () => {
    const subject = (() => renderer.render(mockRequest));
    let mockRequest = null;

    t.beforeEach(() => {
      mockParams = {hoge: 'fuga'};
      mockRequest = new Request('http://localhost:3000/hoge', mockParams);
    });

    t.it('Render html', () => {
      return subject().then((html) => {
        t.expect(/^<html>[\s\S]+<\/html>$/.test(html)).equals(true);
      }).catch((e) => {
        console.error(e);
        throw new Error('fail');
      });
    });

    t.it('Render style', () => {
      return subject().then((html) => {
        dom = Cheerio.load(html);
        t.expect(dom('style').toString()).equals('<style id="preload-css">.hoge{background:#0ff}</style>');
      });
    });

    t.it('Render attrs', () => {
      return subject().then((html) => {
        attrs = JSON.parse(Cheerio.load(html)('#attrs').text());
        t.expect(attrs).deepEquals({
          'X-SERVER-PARAMS': mockParams,
          'X-SERVER-URL':    'http://localhost:3000/hoge',
          'X-SERVER-ASSETS': asset.paths,
        });
      });
    });

    t.context('When has cache', () => {
      t.beforeEach(() => {
        Config.cache.get = t.spy(() => 'cached value');
      });

      t.afterEach(() => {
        Config.cache.get = t.spy(() => null);
      });

      t.it('Return cache', () => {
        return subject().then((html) => {
          t.expect(html).equals('cached value');
        });
      });
    });
  });
});
