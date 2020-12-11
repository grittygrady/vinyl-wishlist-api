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
      const { username, password } = sanitizeUser(req.body);

      req.session.user = { username };
      console.log(req.session.user);
      res.send({ username });
    })
    // SELECT REQ.PARAMS.USERNAME WHERE USERS.USERNAME === BOB
    // ERROR MSG IN EVENT OF A 403 IF !USER REDIR TO LOGIN OR REGISTRATION
    // ELSE
    // BCRYPT.COMPARESYNCH(UNHASHED REQ.PARAMS.PASSWORD, USER.PASSWORD)
    // IF ELSE LOGIN OR REGISTER REDIRECT
    // IF SUCCESFUL req.session.user = user
    // CONTINUE RES => ETC RES SEND
    .catch(next);
});
loginRouter.get(
  "/api/user",
  (req, res) =>
    console.log(req.session, "checking session for user") ||
    res.send({ username: req.session.user.username })
);

module.exports = loginRouter;
