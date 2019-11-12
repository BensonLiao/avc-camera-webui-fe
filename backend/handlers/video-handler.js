const ShutterSpeed = require('webserver-form-schema/constants/shutter-speed');
const WhiteBalanceType = require('webserver-form-schema/constants/white-balance-type');
const ApertureType = require('webserver-form-schema/constants/aperture-type');
const DaynightType = require('webserver-form-schema/constants/daynight-type');
const OrientationType = require('webserver-form-schema/constants/orientation-type');
const RefreshRate = require('webserver-form-schema/constants/refresh-rate');

exports.getVideoSettings = (req, res) => {
  /*
  GET /api/video/settings
   */
  res.json({
    defoggingEnabled: false,
    irEnabled: false,
    brightness: 0,
    contrast: 0,
    hdrEnabled: 'false',
    shutterSpeed: ShutterSpeed.auto,
    aperture: ApertureType.auto,
    saturation: 0,
    whiteblanceMode: WhiteBalanceType.auto,
    whiteblanceManual: 0,
    daynightMode: DaynightType.auto,
    timePeriodStart: 0,
    timePeriodEnd: 0,
    sharpness: 0,
    orientation: OrientationType.normal,
    refreshRate: RefreshRate.auto,
    sensitivity: 0,
    autoFocusEnabled: false,
    focalLength: 1,
    zoom: 1
  });
};

exports.resetVideoSettings = (req, res) => {
  /*
  POST /api/video/settings/_reset
   */
  res.status(204).send();
};

exports.updateVideoSettings = (req, res) => {
  /*
  PUT /api/video/settings
   */
  res.json(req.body);
};
