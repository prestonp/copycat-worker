/**
 * Worker script performs a blocking pop off the work queue
 * and generates the screenshot.
 */

var config = require('./config');
var redis = require('redis');
var client = redis.createClient();
var spawn = require('child_process').spawn;
var colors = require('colors');
var base62 = require('base62');

var worker = function(opts) {
  opts = opts || {};
  return this;
};

worker.prototype.getFilename = function(id) {
  return config.outputPath + base62.encode(id) + config.fileExt;
};

worker.prototype.tick = function() {
  client.blpop(config.queue, config.timeout, this.render);
};

worker.prototype.render = function(err, res) {
  if (err) {
    throw new Error('Error:', err);
  }

  var data;

  try {
    data = JSON.parse(res[1]);
  } catch(e) {
    return console.error(e);
  }

  var filename = this.getFilename(data.id);
  var args = ['rasterize.js', data.url, filename];
  var phantom  = spawn('phantomjs', args);

  phantom.on('close', function (code) {
    if ( code === 0 ) {
      this.log(('Rendered ' + data.url + ' to ' + filename).green);
    } else {
      this.log(('Error rendering ' + data.url).red);
    }
  });
  this.log(('Processing ' + data.url).green);
  this.tick();
  return this;
};

worker.prototype.run = function() {
  this.log('Running..');
  this.tick();
  return this;
};

worker.prototype.log = function() {
  var args = Array.prototype.slice.call(arguments);
  var prefix = '[PID ' + process.pid + '] ';
  prefix = prefix.green;
  args[0] = prefix + args[0];
  console.log.apply(this, args);
};

module.exports = function (opts) {
  return new worker(opts);
}
