# TrackServerRenderer
Server-side renderer for track.

## Installation

### npm

```shell
npm install track-server-renderer
```

## Usage

```javascript
const TrackConfig = require('track-config');

TrackConfig.configure((c) => {
  c.m = require('mithril');

  c.loader = function(module) {
    return require(`./app/${module}`);
  };
});
```
