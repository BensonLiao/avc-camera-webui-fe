exports.getSystemInformation = (req, res) => {
  /*
  GET /api/system/information
   */
  res.json({
    languageCode: 'en-us',
    deviceName: 'IP Camera',
    isEnableFaceRecognition: false,
    isEnableAgeGender: false,
    isEnableHumanoidDetection: false,
    deviceStatus: 1,
    usedDiskSize: 3117 * 1024 * 1024,
    totalDiskSize: 7692 * 1024 * 1024
  });
};

exports.updateDeviceName = (req, res) => {
  /*
  PUT /api/system/device-name
   */
  res.json(req.body);
};

exports.updateLanguage = (req, res) => {
  /*
  PUT /api/system/language
   */
  res.json(req.body);
};
