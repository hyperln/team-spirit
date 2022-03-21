const cms = require('./cms');

module.exports = async () => {
  const redirects = await cms().getRedirects();
  return redirects;
};