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
var db = require('./db');

var worker = function(opts) {
  opts = opts || {};
  return this;
};

worker.prototype.getFilename = function(id) {
  return base62.encode(id) + config.fileExt;
};

worker.prototype.getFilePath = function(filename) {
  return config.outputPath + filename;
};

worker.prototype.tick = function() {
  client.blpop(config.queue, config.timeout, this.render.bind(this));
};

worker.prototype.render = function(err, res) {
  var self = this;

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
  var filePath = this.getFilePath(filename);
  var args = ['rasterize.js', data.url, filePath];
  var phantom  = spawn('phantomjs', args);

  phantom.on('close', function (code) {
    if ( code === 0 ) {
      self.log(('Rendered ' + data.url + ' to ' + filename).green);
      db.query('update images set status = \'complete\', filename = $1 where id = $2', [filename, data.id], function(err, rows, result) {
        if (err) self.log('Error:', err);
      });
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
