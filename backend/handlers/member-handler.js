exports.addMember = (req, res) => {
  res.json({
    name: req.body.name,
    organization: req.body.organization,
    groupId: req.body.groupId,
    note: req.body.note,
    pictures: req.body.pictures
  });
};

exports.getMembers = (req, res) => {
  res.json({
    items: [
      {
        id: 1,
        name: 'abby2',
        organization: 'SW',
        groupId: 0,
        note: 'note',
        pictures: [
          'iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN'
        ]
      }
    ]
  });
};
