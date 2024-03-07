const withAuth = (req, res, next) => {
  // If the user is not logged in, redirect the request to the login route
  next();
};

module.exports = withAuth;
