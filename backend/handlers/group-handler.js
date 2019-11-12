exports.getGroups = (req, res) => {
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
  res.json({
    id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
    name: '業務部',
    note: '#主要執行AVC與AB的相關業務部門'
  });
};

exports.addGroup = (req, res) => {
  res.json({
    id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
    name: '業務部',
    note: '#主要執行AVC與AB的相關業務部門'
  });
};

exports.updateGroup = (req, res) => {
  res.json({
    id: '40d1e5fd-3dd7-4ad1-a4c8-0ca928060778',
    name: '業務部',
    note: '#主要執行AVC與AB的相關業務部門'
  });
};

exports.deleteGroup = (req, res) => {
  res.status(204).send();
};
