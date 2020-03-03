const config = require('config');
const got = require('got');

exports.getServiceWorker = (req, res) => {
  return got.get(
    `http://${config.webpackDevServer.host}:${config.webpackDevServer.port}/service-worker.js`,
    {responseType: 'buffer'}
  )
    .then(response => {
      res.set({
        'Content-Type': 'application/javascript',
        'Service-Worker-Allowed': '/'
      });
      res.send(response.body);
    });
};
