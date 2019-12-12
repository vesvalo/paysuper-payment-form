const path = require('path');

const aliases = {
  '@': 'src',
};

module.exports = {
  webpack: {},
};

function resolveSrc(_path) {
  return path.resolve(__dirname, _path);
}

Object.keys(aliases, (alias) => {
  const aliasTo = aliases[alias];
  module.exports.webpack[alias] = resolveSrc(aliasTo);
});
