var redis = require('redis')
  , client = redis.createClient()
  , colors = require('colors')
  , config = require('./config')
  , spawn = require('child_process').spawn;

console.log('Watching queue..'.green);

var loop = function() {
  client.blpop(config.queue, config.timeout, function(err, res) {
    if (err) {
      console.error('Error:', err);
    } else {
      // WORK!
      var url = res[1];
      var phantom  = spawn('phantomjs', ['rasterize.js', url, 'lol.png']);
      phantom.stdout.on('data', function(data) {
        console.log(data.toString().magenta);
      });
      console.log(('Processing ' + url).green);
    }

    loop();
  });
};

loop();
