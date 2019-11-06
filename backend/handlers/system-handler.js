exports.getSystemInformation = (req, res) => {
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
  res.json(req.body);
};
