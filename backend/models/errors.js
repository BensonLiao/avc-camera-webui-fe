exports.Http400 = class Http400 extends Error {
  constructor(message, extra) {
    super(message || 'bad request');
    this.status = 400;
    this.extra = extra;
  }
};

exports.Http401 = class Http401 extends Error {
  constructor(message, extra) {
    // Redirect to the login page.
    super(message || 'unauthorized');
    this.status = 401;
    this.extra = extra;
  }
};

exports.Http403 = class Http403 extends Error {
  constructor(message, extra) {
    super(message || 'permission denied');
    this.status = 403;
    this.extra = extra;
  }
};

exports.Http404 = class Http404 extends Error {
  constructor(message, extra) {
    super(message || 'resource not found');
    this.status = 404;
    this.extra = extra;
  }
};

exports.Http500 = class Http500 extends Error {
  constructor(message, extra) {
    super(message || 'server error');
    this.status = 500;
    this.extra = extra;
  }
};
