const
  app = require('./dist/app'),
  logger = require('winston'),
  cluster = require('cluster');

if (cluster.isMaster) {
  // Fork all the workers.
  const CONCURRENCY = process.env.WEB_CONCURRENCY || 1;

  for (var i = 0; i < CONCURRENCY; i++) {
    cluster.fork();
  }

  Object.keys(cluster.workers).forEach(id => {
    logger.log('Running with process ID', cluster.workers[id].process.pid);
  });

  cluster.on('exit', worker => {
    var restartDelay = parseInt(process.env.RESTART_DELAY, 10) || 30000;
    logger.log('Process ID', worker.process.pid, 'died, creating new worker in', (restartDelay / 1000), 'seconds');
    setTimeout(cluster.fork, restartDelay);
  });
} else {
  app.start();
}