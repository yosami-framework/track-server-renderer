require('./spec_helper');
const t      = require('track-spec');
const Digest = require('../lib/digest');

t.describe('Digest', () => {
  t.describe('.md5', () => {
    const subject = (() => Digest.md5('HogeFugaPiyo'));

    t.it('Return hex digest', () => {
      t.expect(subject()).equals('478f0070d65f6f8df05d0d9ae0b3ebee');
    });
  });
});
