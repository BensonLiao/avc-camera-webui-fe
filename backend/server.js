const path = require('path');
const http = require('http');
const config = require('config');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const leftPad = require('left-pad');
const handlebars = require('handlebars');
const errors = require('./models/errors');
const webRouter = require('./routers/web-router');

const app = express();
const server = http.createServer(app);

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
app.set('views', path.join(__dirname, '..', 'dist', 'express-templates'));
app.engine('html', hbs.engine);
app.set('view engine', 'html');

// Append config at locals
app.locals.config = {
  languages: config.languages,
  isDebug: config.isDebug,
  cookie: {
    redirect: 'redirect'
  }
};
app.locals.languageCode = 'zh-tw';
app.locals.user = {
  name: 'username'
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
    console.log(`[${res.statusCode}] ${leftPad(processTime, 7)}ms ${(req.method + '      ').substr(0, 6)} ${req.originalUrl}`);
    if (res.error) {
      console.error(res.error.message);
      console.error(res.error.stack);
    }
  };

  next();
});

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
      message: error.message
    });
  } else {
    res.render('error', {error: error});
  }
});

// Launch server
server.listen(config.expressServer.port, config.expressServer.host, () => {
  const {address, port} = server.address();
  console.log(`Server listening at http://${address}:${port}`);
});
