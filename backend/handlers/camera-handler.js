exports.getProperties = (req, res) => {
  res.json({
    defog: false,
    irLight: false,
    bright: 50,
    contrast: 50,
    wdr: 'auto',
    shutterSpeed: 'auto',
    iris: 'auto'
  });
};
