exports.addMember = (req, res) => {
  res.json({
    name: req.body.name,
    organization: req.body.organization,
    groupId: req.body.groupId,
    note: req.body.note,
    pictures: req.body.pictures
  });
};
