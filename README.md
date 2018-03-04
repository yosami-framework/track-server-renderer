# TrackServerRenderer
Server-side renderer for track.

## Installation

### npm

```shell
npm install track-server-renderer
```

## Usage

```javascript
const Renderer = require('track-server-renderer');
const Asset    = require('track-server-renderer/lib/asset');
const Config   = require('track-server-renderer/lib/config');
const Request  = require('track-server-renderer/lib/request');

Config.configure((c) => {
  c.browserMock = require('mithril/test-utils/browserMock');
  c.cache = new CacheBase();
});

const asset    = new Asset(assetsDir, 'mock.js', 'mock.css');
const renderer = TrackServerRenderer(TrackController, asset);

const request = new Request('http://localhost:3000/hoge?hoge=fuga', {hoge: 'fuga'});
renderer.render(request);
```
