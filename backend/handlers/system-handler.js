exports.getStatus = (req, res) => {
  res.json({
    faceRecognition: 'on',
    ageGender: 'on',
    humanoidDetection: 'on',
    state: 'success',
    usedDiskSize: 3117 * 1024 * 1024,
    totalDiskSize: 7692 * 1024 * 1024
  });
};
