exports.getSettings = (req, res) => {
  res.json({
    defog: false,
    irLight: false,
    bright: 50,
    contrast: 50
  });
};
