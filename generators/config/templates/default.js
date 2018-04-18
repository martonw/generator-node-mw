
// This is the default configuration of the app
var config = {

  data_dir: './data',
  <% if (logging) { %>
  logging: {
    dir: './logs',
    level: 'info',
    rotate_count: 20
  },
  <% } %>
  <% if (express) { %>
  // Configuration for the service endpoint (http)
  service: {
    httpPort: 3000,
    httpsPort: undefined,

  },
  <% } %>
  <% if (adapter) { %>
  adapters: {

  },
  <% } %>

};

module.exports = config;
