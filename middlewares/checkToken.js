require("dotenv").config();

const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_KEY || "no_secret";

const checkToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      error: true,
      message: "Please provide a authorization token",
    });
  }

  try {
    // Must have space after bearer
    if (token.toLowerCase().startsWith("bearer ")) {
      token = token.slice("bearer".length).trim();
      const jwtPayload = jwt.verify(token, secretKey);
      if (!jwtPayload) {
        return res.status(403).json({
          error: true,
          message: "Unauthenticated",
        });
      }

      res.adminuser = jwtPayload;
      next();
    } else {
      return res.status(403).json({
        error: true,
        message: "Please provide a valid token",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      response: error,
    });
  }
};

module.exports = checkToken;
