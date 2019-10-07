exports.getGroups = (req, res) => {
  res.json({
    items: [
      {
        id: 1,
        name: '業務部',
        note: ''
      }
    ]
  });
};
