const express = require("express");
const xss = require("xss");
const bcrypt = require("bcrypt");
const LoginService = require("./login-service");

const loginRouter = express.Router();
const jsonParser = express.json();

const sanitizeUser = (user) => ({
  username: xss(user.username),
  password: xss(user.password),
});

loginRouter.route("/api/login").post(jsonParser, (req, res, next) => {
  LoginService.getUser(req.app.get("db"), req.body.username)
    .then((user) => {
      if (!bcrypt.compareSync(req.body.password, user.password))
        throw new Error("Invalid password");
      const { username } = sanitizeUser(req.body);

      req.session.user = { username }
      res.send({ username })
    })
    .catch(next);
});
loginRouter.get(
  "/api/user",
  (req, res) => 
    console.log(req.session, "checking session for user") ||
    res.send({ username: req.session.user?.username })
);
loginRouter.delete(
  "/api/user",
  (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.status(400).send('Unable to log out')
        } else {
          res.send('Logout successful')
        }
      });
    } else {
      res.end()
    }
  })

module.exports = loginRouter;
