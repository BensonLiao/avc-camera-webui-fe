exports.getGroups = (req, res) => {
  res.json({
    items: [
      {
        id: 1,
        name: '業務部',
        note: '#主要執行AVC與AB的相關業務部門'
      }
    ]
  });
};

exports.getGroup = (req, res) => {
  res.json({
    id: 1,
    name: '業務部',
    note: '#主要執行AVC與AB的相關業務部門'
  });
};

exports.addGroup = (req, res) => {
  res.json({
    id: 1,
    name: '業務部',
    note: '#主要執行AVC與AB的相關業務部門'
  });
};

exports.updateGroup = (req, res) => {
  res.json({
    id: 1,
    name: '業務部',
    note: '#主要執行AVC與AB的相關業務部門'
  });
};

exports.deleteGroup = (req, res) => {
  res.status(204).send();
};
