const path = require('path');
const http = require('http');
const config = require('config');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const handlebars = require('handlebars');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const open = require('open');

const errors = require('./models/errors');
const webRouter = require('./routers/web-router');
const baseHandler = require('./handlers/base-handler');

const app = express();
const server = http.createServer(app);
// To integarte with webpack-dev-middleware, use another config to serve at localhost when in dev mode
const serverConfig = config.isDebug ? config.expressDevServer : config.expressServer;

const webpackConfig = require('../webpack.config.js')();
const compiler = webpack(webpackConfig);
const webpackDevInstance = webpackDevMiddleware(compiler, {
  writeToDisk: true,
  publicPath: webpackConfig.output.publicPath
});

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevInstance);

// Setup handlebars
const hbs = expressHandlebars.create({
  extname: '.html',
  defaultLayout: false,
  helpers: {
    archive: object =>
      new handlebars.SafeString((Buffer.from(JSON.stringify(object))).toString('base64'))
  }
});
// Setup template engine
app.set('views', path.join(__dirname, '..', 'dist', 'express'));
app.engine('html', hbs.engine);
app.set('view engine', 'html');

// Append config at locals
app.locals.config = {
  languages: config.languages,
  isDebug: config.isDebug,
  cookies: {
    redirect: 'redirect',
    language: 'lang'
  }
};

app.use((req, res, next) => {
  // Add req.startTime
  req.startTime = new Date();
  // Append end hook
  const originEndFunc = res.end;
  res.end = function () {
    originEndFunc.apply(this, arguments);
    const now = new Date();
    const processTime = `${now - req.startTime}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    console.log(`[${res.statusCode}] ${processTime.padStart(7)}ms ${(req.method + '      ').substr(0, 6)} ${req.originalUrl}`);
    if (res.error) {
      console.error(res.error.message);
      console.error(res.error.stack);
    }
  };

  next();
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser()); // Setup req.cookies
app.use(webRouter);

// HTTP error handlers
app.use((req, res, next) => {
  next(new errors.Http404());
});
app.use((error, req, res, _) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.error = error;
  if (req.headers.accept && req.headers.accept.indexOf('application/json') >= 0) {
    res.json({
      message: `${error}`,
      extra: error.extra
    });
  } else {
    baseHandler.baseView(req, res);
  }
});

// Launch server and open browser on demand
server.listen(
  serverConfig.port, serverConfig.host, () => {
    const {address, port} = server.address();
    console.log(`Server listening at http://${address}:${port}.`);
    if (process.env.OPEN && process.env.OPEN === '1') {
      webpackDevInstance.waitUntilValid(async () => {
        try {
          await open(`http://${address}:${port}`);
        } catch {
          console.warn(`Unable to open http://${address}:${port}.`);
        }
      });
    }
  }
);
