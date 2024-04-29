const { II, DD, EE } = require('./logging');

module.exports = api => ({
  GET: (path, fn) => {
    const wrapFn = (req, res) => {
      // FIXME: i fthe path contains /:*/, replace * with req.params.*
      II(`* API; endpoint: ${path} ...`);
      fn(req, res);
    }
    api.get(path, wrapFn);
  },
  // TODO: POST. PUT, etc.
})
