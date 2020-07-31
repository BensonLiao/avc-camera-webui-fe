module.exports = {
  isDebug: true,
  expressServer: {
    host: '0.0.0.0',
    port: 8001
  },
  webpackDevServer: {
    host: 'localhost',
    port: 8002
  },
  languages: {
    'en-us': {title: 'English'},
    'zh-tw': {title: '中文(繁體)'},
    'zh-cn': {title: '中文(简体)'},
    'ja-jp': {title: '日本語'},
    'es-es': {title: 'Spanish'}
  },
  rootPassword: 'Root123!'

};
