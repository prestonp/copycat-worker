var redis = require('redis')
  , client = redis.createClient()
  , colors = require('colors')
  , config = require('./config')
  , spawn = require('child_process').spawn
  , base62 = require('base62');

console.log('Watching queue..'.green);

function getFilename(id) {
  return config.outputPath + base62.encode(id) + config.fileExt;
}

var loop = function() {
  client.blpop(config.queue, config.timeout, function(err, res) {
    if (err) {
      console.error('Error:', err);
      return loop();
    }

    var data = JSON.parse(res[1]);
    var filename = getFilename(data.id);
    var phantom  = spawn('phantomjs', ['rasterize.js', data.url, filename]);

    phantom.on('close', function (code) {
      if ( code === 0 ) {
        console.log(('Rendered ' + data.url + ' to ' + filename).green);
      } else { 
        console.log(('Error rendering ' + data.url).red);
      }
    });
    console.log(('Processing ' + data.url).green);
    loop();
  });
};

loop();
