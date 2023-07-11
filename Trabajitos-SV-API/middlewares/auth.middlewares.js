const { verifyToken } = require("../utils/jwt.tools");
const debug = require("debug")("app:auth-middleware");
const User = require("../models/user.model");

const ROLES = require("./../data/roles.constants.json");

const middlewares = {};

const tokenPrefix = "Bearer";

middlewares.authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(authorization);
    if (!authorization) {
      return res.status(401).json({ error: "No authorization" });
    }

    const [prefix, token] = authorization.split(" ");

    if (prefix !== tokenPrefix) {
      return res.status(401).json({ error: "No authorization" });
    }

    if (!token) {
      return res.status(401).json({ error: "No authorization" });
    }

    const tokenObject = verifyToken(token);

    if (!tokenObject) {
      return res.status(401).json({ error: "No authorization" });
    }

    const { userId } = tokenObject;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: "No authorization" });
    }

    const isTokenValid = user.tokens.includes(token);
    if (!isTokenValid) {
      return res.status(401).json({ error: "No authorization" });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Unexpected server error" });
  }
};

middlewares.authorization = (roleRequired = ROLES.SYSADMIN) => {
  return (req, res, next) => {
    try {
      const { roles = [] } = req.user;

      const roleIndex = roles.findIndex(
        (role) => role == roleRequired || role == ROLES.SYSADMIN
      );

      if (roleIndex < 0) {
        return res.status(403).json({ error: "You don't have permissions" });
      }

      next();
    } catch (error) {
      debug({ error });
      return res.status(500).json({ error: "Unexpected server error" });
    }
  };
};


module.exports = middlewares;