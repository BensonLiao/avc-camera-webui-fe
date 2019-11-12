exports.getGroups = (req, res) => {
  /*
  GET /api/groups
   */
  res.json({
    items: [
      {
        id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
        name: '業務部',
        note: '#主要執行AVC與AB的相關業務部門'
      },
      {
        id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060779',
        name: '業務部2',
        note: ''
      }
    ]
  });
};

exports.getGroup = (req, res) => {
  /*
  GET /api/groups/:groupId
   */
  res.json({
    id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
    name: '業務部',
    note: '#主要執行AVC與AB的相關業務部門'
  });
};

exports.addGroup = (req, res) => {
  /*
  POST /api/groups
   */
  res.json({
    id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
    name: '業務部',
    note: '#主要執行AVC與AB的相關業務部門'
  });
};

exports.updateGroup = (req, res) => {
  /*
  PUT /api/groups/:groupId
   */
  res.json({
    id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
    name: '業務部',
    note: '#主要執行AVC與AB的相關業務部門'
  });
};

exports.deleteGroup = (req, res) => {
  /*
  DELETE /api/groups/:groupId
   */
  res.status(204).send();
};
