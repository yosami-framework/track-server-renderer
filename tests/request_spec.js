require('./spec_helper');
const t       = require('track-spec');
const Request = require('../lib/request');

t.describe('Request', () => {
  let request    = null;
  let mockParams = null;

  t.beforeEach(() => {
    mockParams = {hoge: 'fuga'};
    request = new Request('http://localhost:3000/hoge', mockParams)
  });

  t.describe('#url', () => {
    const subject = (() => request.url);

    t.it('Return url', () => {
      t.expect(subject()).equals('http://localhost:3000/hoge');
    });
  });

  t.describe('#params', () => {
    const subject = (() => request.params);

    t.it('Return params', () => {
      t.expect(subject()).equals(mockParams);
    });
  });
});
