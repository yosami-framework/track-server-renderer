require('./spec_helper');
const t           = require('track-spec');
const TrackConfig = require('track-config');
const path        = require('path');
const Asset       = require('../lib/asset');

t.describe('Asset', () => {
  let asset = null;

  t.beforeEach(() => {
    const publicDir = path.resolve(__dirname, 'fixtures');
    asset = new Asset(publicDir, '/assets/mock.js', '/assets/mock.css');
  });

  t.describe('#directory', () => {
    const subject = (() => asset.directory);

    t.it('Return paths', () => {
      t.expect(subject()).deepEquals(path.resolve(__dirname, 'fixtures'));
    });
  });

  t.describe('#raws', () => {
    const subject = (() => asset.raws);

    t.it('Return data', () => {
      t.expect(subject()).deepEquals({
        js:  'var hoge = \'fuga\';\n',
        css: '.hoge { background: #0ff } .fuga { background: #ff0 }\n',
      });
    });

    t.context('When set relativeUrlRoot', () => {
      t.beforeEach(() => {
        TrackConfig.relativeUrlRoot = '/my-app';
        const publicDir = path.resolve(__dirname, 'fixtures');
        asset = new Asset(publicDir, '/my-app/assets/mock.js', '/my-app/assets/mock.css');
      });

      t.afterEach(() => {
        TrackConfig.relativeUrlRoot = undefined;
      });

      t.it('Return data', () => {
        t.expect(subject()).deepEquals({
          js:  'var hoge = \'fuga\';\n',
          css: '.hoge { background: #0ff } .fuga { background: #ff0 }\n',
        });
      });
    });
  });
});
