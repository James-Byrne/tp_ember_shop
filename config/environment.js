/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'tp-ember-shop',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      EXTEND_PROTOTYPES: {
        Date: false,
        Array: true
      },

      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  /* eslint-disable */
  ENV.contentSecurityPolicy = {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-eval'",
    'font-src': "'self'",
    'connect-src': "'self' http://localhost:8001 http://34.250.176.158",
    'img-src': "'self' http://localhost:8001 http://34.250.176.158",
    'style-src': "'self' 'unsafe-inline'",
    'media-src': "'self'"
  };
  /* eslint-enable */

  if (environment === 'development') {
    ENV.shop_url = 'http://localhost:8001';
    ENV.three_d_return = 'http://localhost:8801/three_d_success';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.shop_url = 'http://34.250.176.158';
    ENV.three_d_return = 'http://34.250.176.158/three_d_success';
  }

  return ENV;
};
