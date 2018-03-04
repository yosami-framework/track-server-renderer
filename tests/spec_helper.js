const CacheBase   = require('../lib/cache_base');
const Config      = require('../lib/config');
const TrackConfig = require('track-config');

Config.configure((c) => {
  c.browserMock = require('mithril/test-utils/browserMock');
  c.cache = new CacheBase();
});

TrackConfig.configure((c) => {
  c.m = require('mithril');
  c.loader = ((module) => require(`./fixtures/${module}`));
});
