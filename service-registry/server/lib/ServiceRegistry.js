
const semver = require('semver');

class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 30;
  }

  get(name, version) {
    this.cleanup();
    const candidates = Object.values(this.services)
      .filter(service => service.name === name && semver.satisfies(service.version, version));
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  register(name, version, ip, port) {
    const key = `${name}${version}${ip}${port}`;
    this.cleanup();
    if (!this.services[key]) {
      this.services[key] = {
        timestamp: Math.floor(Date.now() / 1000),
        ip,
        port,
        name,
        version,
      };
      this.log.debug(`Added services ${name}, ${version} at ${ip}:${port}`);
      return key;
    }
    this.services[key].timestamp = Math.floor(Date.now() / 1000);
    this.log.debug(`Updated services ${name}, ${version} at ${ip}:${port}`);
    return key;
  }

  unregister(name, version, ip, port) {
    const key = `${name}${version}${ip}${port}`;
    delete this.services[key];
    this.log.debug(`unregistered services ${name}, ${version} at ${ip}:${port}`);
    return key;
  }

  cleanup() {
    const now = Math.floor(Date.now() / 1000);
    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];
        this.log.debug(`Removed service ${key}`);
      }
    });
  }
}

module.exports = ServiceRegistry;
