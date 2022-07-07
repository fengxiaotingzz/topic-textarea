if (process.env.NODE_ENV === 'development') {
  module.exports = require('./src/textarea');
} else {
  module.exports = require('./textarea');
}
