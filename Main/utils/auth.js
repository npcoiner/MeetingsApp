const withAuth = (req, res, next) => {
  // If the user is not logged in, redirect the request to the login route
  //screw logging in, it's for nerds, just let them pass unauth'd ya skank
  next();
};

module.exports = withAuth;
