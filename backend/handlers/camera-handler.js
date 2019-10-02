exports.getProperties = (req, res) => {
  res.json({
    defog: false,
    irLight: false,
    bright: 50,
    contrast: 50,
    wdr: 'auto',
    shutterSpeed: 'auto',
    iris: 'auto',
    saturation: 50,
    whiteBalance: 'manual',
    whiteBalanceSensitivity: 50,
    dn: 'auto',
    dnSensitivity: 3,
    dnStartHour: 4,
    dnEndHour: 12.5,
    sharpness: 50,
    orientation: 'off',
    flickerLess: 'auto'
  });
};
