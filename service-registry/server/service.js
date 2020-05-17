const express = require('express');

const service = express();
const ServiceRegistry = require('./lib/ServiceRegistry');

module.exports = (config) => {
  const log = config.log();
  // Add a request logging middleware in development mode
  const serviceRegistry = new ServiceRegistry(log);

  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.put(
    '/register/:servicename/:serviceversion/:serviceport',
    (req, res) => {
      const { servicename, serviceversion, serviceport } = req.params;
      const serviceip = req.connection.remoteAddress.includes('::')
        ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;
      const serviceKey = serviceRegistry
        .register(servicename, serviceversion, serviceip, serviceport);
      return res.json({ result: serviceKey });
    },
  );
  service.delete(
    '/register/:servicename/:serviceversion/:serviceport',
    (req, res) => {
      const { servicename, serviceversion, serviceport } = req.params;
      const serviceip = req.connection.remoteAddress.includes('::')
        ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;
      const serviceKey = serviceRegistry
        .unregister(servicename, serviceversion, serviceip, serviceport);
      return res.json({ result: serviceKey });
    },
  );

  service.get('/find/:servicename/:serviceversion', (req, res) => {
    const { servicename, serviceversion } = req.params;
    const svc = serviceRegistry.get(servicename, serviceversion);
    if (!svc) return res.status(404).json({ result: 'Service not found' });
    return res.json(svc);
  });


  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return service;
};
