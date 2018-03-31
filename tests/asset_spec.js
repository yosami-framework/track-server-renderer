require('./spec_helper');
const t     = require('track-spec');
const path  = require('path');
const Asset = require('../lib/asset');

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
  });

  t.describe('#paths', () => {
    const subject = (() => asset.paths);

    t.it('Return paths', () => {
      t.expect(subject()).deepEquals({
        js:  '/assets/mock.js',
        css: '/assets/mock.css',
      });
    });
  });
});
