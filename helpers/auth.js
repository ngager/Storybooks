module.exports = {
  ensureAuthenticated: function(request, response, next) {
    if (request.isAuthenticated()) {
      return next();
    }
    response.redirect('/');
  },
  ensureGuest: function(request, response, next) {
    if (!request.isAuthenticated()) {
      return next();
    }
    response.redirect('/dashboard');
  }
}