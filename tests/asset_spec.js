require('./spec_helper');
const t     = require('track-spec');
const path  = require('path');
const Asset = require('../lib/asset');

t.describe('Asset', () => {
  let asset = null;

  t.beforeEach(() => {
    const assetsDir = path.resolve(__dirname, 'fixtures', 'assets');
    asset = new Asset(assetsDir, 'mock.js', 'mock.css');
  });

  t.describe('#digests', () => {
    const subject = (() => asset.digests);

    t.it('Return paths', () => {
      t.expect(subject()).deepEquals({
        js:  '720e86eb7e65b9e335363d9831524168',
        css: 'd67eb08e3d122fdd4d7054dd6d25fb33',
      });
    });
  });

  t.describe('#directory', () => {
    const subject = (() => asset.directory);

    t.it('Return paths', () => {
      t.expect(subject()).deepEquals(path.resolve(__dirname, 'fixtures', 'assets'));
    });
  });

  t.describe('#raws', () => {
    const subject = (() => asset.raws);

    t.it('Return paths', () => {
      t.expect(subject()).deepEquals({
        js:  'var hoge = \'fuga\';\n',
        css: '.hoge { background: #0ff }; .fuga { background: #ff0 };\n',
      });
    });
  });

  t.describe('#serverPaths', () => {
    const subject = (() => asset.serverPaths);

    t.it('Return paths', () => {
      t.expect(subject()).deepEquals({
        js:  `/mock.js?${asset.digests.js}`,
        css: `/mock.css?${asset.digests.css}`,
      });
    });
  });
});
