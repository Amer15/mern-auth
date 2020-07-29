const jwt = require('jsonwebtoken');

//Middleware to verify all protected routes before proceeding to controllers
exports.authorize = (req, res, next) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY, (err, decode) => {
      if (err) {
        return res.status(401).json({
          error: `Unauthorized access ${err}`,
        });
      }
  
      next();
    });
  };