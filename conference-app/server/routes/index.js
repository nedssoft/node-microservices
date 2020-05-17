/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();

const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

module.exports = (param) => {
  const { speakers } = param;


  router.get('/images/:type/:fileName', async (req, res, next) => {
    try {
      const image = await speakers.getImage(`${req.params.type}/${req.params.fileName}`);
      return image.pipe(res);
    } catch (err) {
      next(err);
    }
  });
  router.get('/', async (req, res, next) => {
    try {
      const promises = [];
      promises.push(speakers.getListShort());
      promises.push(speakers.getAllArtwork());

      const results = await Promise.all(promises);

      return res.render('index', {
        page: 'Home',
        speakerslist: results[0],
        artwork: results[1],
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRoute(param));
  router.use('/feedback', feedbackRoute(param));

  return router;
};
