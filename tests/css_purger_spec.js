require('./spec_helper');
const t         = require('track-spec');
const fs        = require('fs');
const path      = require('path');
const CSSPurger = require('../lib/css_purger');

t.describe('CSSPurger', () => {
  let html = null;
  let css  = null;

  t.beforeEach(() => {
    html = [
      '<div class="aaa b c"></div>',
      '<div class="d ee fff"></div>',
      '<div class="g"><div class="h"></div></div>',
    ].join('');

    css = [
      '.a      { content: "hi!" }',
      '.aaa.b  { content: "hi!" }',
      '.a, .d  { content: "hi!" }',
      '.aaa.ee { content: "hi!" }',
      '.g .h   { content: "hi!" }',
      'ul      { content: "hi!" }',
      'ul, div { content: "hi!" }',
    ].join('');
  });

  t.describe('.purge', () => {
    const subject = (() => CSSPurger.purge(css, html));

    t.it('Purge CSS', () => {
      t.expect(subject()).equals('.aaa.b{content:"hi!"}.d{content:"hi!"}.g .h{content:"hi!"}div{content:"hi!"}');
    });

    t.context('When css has keyframes', () => {
      t.beforeEach(() => {
        css = [
          '@keyframes anim1 { 0% { content: "0" } 100% { content: "100" } }',
          '@keyframes anim2 { from { content: "0" } to { content: "100" } }',
        ].join('');
      });

      t.it('Purge CSS', () => {
        t.expect(subject()).equals('@keyframes anim1{0%{content:"0"}100%{content:"100"}}@keyframes anim2{from{content:"0"}to{content:"100"}}');
      });
    });

    t.context('When css has media', () => {
      t.beforeEach(() => {
        css = [
          '@media (max-width: 600px) { .a{ content: "hi!" } .aaa.b  { content: "hi!" } }',
        ].join('');
      });

      t.it('Purge CSS', () => {
        t.expect(subject()).equals('@media (max-width:600px){.aaa.b{content:"hi!"}}');
      });
    });

    t.context('When big html and css', () => {
      t.beforeEach(() => {
        css = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'assets', 'big_mock.css')).toString();
        html = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'assets', 'big_mock.html')).toString();
      });

      t.it('Check performance', () => {
        console.time('CSSPurger.purge');
        subject();
        console.timeEnd('CSSPurger.purge');
      });

      t.it('Check compressed size', () => {
        console.log(`CSSPurger.purge: ${css.length} -> ${subject().length}`);
      });

      t.it('Purge CSS', () => {
        t.expect(/unuse/.test(subject())).equals(false);
      });
    });
  });
});
