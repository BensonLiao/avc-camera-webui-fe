const mock = require('xhr-mock').default;

module.exports = {
  create: mockDB => {
    let data = mockDB.get('groups').value();
    mock.get('/api/groups', {
      body: JSON.stringify({
        items: data
      })
    });

    data = mockDB.get('members').value();
    mock.get('/api/members', {
      body: JSON.stringify({
        index: 0,
        size: 20,
        total: data.length,
        items: data
      })
    });
  }
};
