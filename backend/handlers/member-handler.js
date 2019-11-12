exports.addMember = (req, res) => {
  /*
  POST /api/members
   */
  res.json({
    name: req.body.name,
    organization: req.body.organization,
    groupId: req.body.groupId,
    note: req.body.note,
    pictures: req.body.pictures
  });
};

exports.updateMember = (req, res) => {
  /*
  PUT /api/members/:memberId
   */
  res.json({
    id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
    name: req.body.name,
    organization: req.body.organization,
    groupId: req.body.groupId,
    note: req.body.note,
    pictures: req.body.pictures
  });
};

exports.getMembers = (req, res) => {
  /*
  GET /api/members
   */
  res.json({
    index: 0,
    size: 20,
    total: 1,
    items: [
      {
        id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
        name: 'abby2',
        organization: 'SW',
        groupId: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060779',
        note: 'note',
        pictures: [
          'iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN'
        ]
      }
    ]
  });
};

exports.getMember = (req, res) => {
  /*
  GET /api/members/:memberId
   */
  res.json({
    id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
    name: 'abby2',
    organization: 'SW',
    groupId: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060779',
    note: 'note',
    pictures: [
      'iVBORw0KGgoAAAANSUhEUgAAANIAAAAzCAYAAADigVZlAAAQN0lEQVR4nO2dCXQTxxnHl0LT5jVteHlN'
    ]
  });
};
