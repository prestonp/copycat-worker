var config = require('./config')
  , cluster = require('cluster')
  , numCPUs = require('os').cpus().length
  , Worker = require('./worker');

if (cluster.isMaster) {
  // Fork workers
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  // Run workers
  var worker = new Worker();
  worker.run();
}
