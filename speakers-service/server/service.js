/* eslint-disable consistent-return */
const express = require('express');

const service = express();

const Speakers = require('./lib/Speakers');

module.exports = (config) => {
  const speakers = new Speakers(config.data.speakers);
  const log = config.log();
  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }
  service.get('/list', async (req, res, next) => {
    try {
      return res.json(await speakers.getList());
    } catch (err) {
      next(err);
    }
  });

  service.get('/list-short', async (req, res, next) => {
    try {
      return res.json(await speakers.getListShort());
    } catch (err) {
      next(err);
    }
  });

  service.get('/names', async (req, res, next) => {
    try {
      return res.json(await speakers.getNames());
    } catch (err) {
      next(err);
    }
  });
  service.get('/speaker/:shortname', async (req, res, next) => {
    try {
      return res.json(await speakers.getSpeaker(req.params.shortname));
    } catch (err) {
      next(err);
    }
  });
  service.get('/artwork', async (req, res, next) => {
    try {
      return res.json(await speakers.getAllArtwork());
    } catch (err) {
      next(err);
    }
  });

  service.get('/artwork/:shotname', async (req, res, next) => {
    try {
      return res.json(await speakers.getArtworkForSpeaker(req.params.shortname));
    } catch (err) {
      next(err);
    }
  });

  service.use('/images/', express.static(config.data.images));
  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.debug(error.message);
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return service;
};
