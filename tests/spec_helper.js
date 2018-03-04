const Initializer = require('../lib/initializer');
const TrackConfig = require('track-config');

Initializer.initialize(require('mithril/test-utils/browserMock'));

TrackConfig.configure((c) => {
  c.m = require('mithril');
  c.loader = ((module) => require(`./fixtures/${module}`));
});
