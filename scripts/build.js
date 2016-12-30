#!/usr/bin/env node
'use strict';

var rollup = require('rollup');
var nodeResolve = require('rollup-plugin-node-resolve');
var babel = require('rollup-plugin-babel');
var commonjs = require('rollup-plugin-commonjs');
var json = require('rollup-plugin-json');

function build(entry, dest, format) {
  rollup.rollup({
    entry: entry,

    external: [
      'clear-require',
      'chai',
      'fs',
      'heimdalljs',
      'heimdalljs-graph',
      'module',
    ],
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      nodeResolve({ jsnext: true, main: true }),
      commonjs({ include: 'node_modules/**' }),
      json(),
    ]
  })
    .then(function (bundle) {
      bundle.write({
        format: format,
        dest: dest
      });
    });
}

build('src/index.js', 'dist/index.js', 'cjs');
build('tests/index.js', 'dist/tests/index.js', 'cjs');
build('tests/fixtures/silly-module.js', 'dist/tests/fixtures/silly-module.js', 'cjs');
build('tests/fixtures/slow-module.js', 'dist/tests/fixtures/slow-module.js', 'cjs');
