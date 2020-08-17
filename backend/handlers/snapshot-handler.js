const got = require('got');
let fakeImage;

exports.getSnapshot = (req, res) => {
  if (fakeImage) {
    // return res.send(fakeImage);
  }

  return got.get('https://picsum.photos/1200/675', {responseType: 'buffer'})
    .then(response => {
      fakeImage = response.body;
      // res.send(response.body);
      res.status(400).send('Bad Request');
    });
};
