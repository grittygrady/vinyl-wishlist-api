const express = require("express");
const xss = require("xss");
const SignupService = require("./signup-service");
const bcrypt = require("bcrypt");

const signupRouter = express.Router();
const jsonParser = express.json();

const sanitizedNewUser = (newUser) => ({
  username: xss(newUser.username),
  email: xss(newUser.email),
  password: xss(newUser.password),
});

signupRouter.route("/api/user").post(jsonParser, (req, res, next) => {
  const { username, email, password } = sanitizedNewUser(req.body);
  hashedPassword = bcrypt.hashSync(password, 12);
  const newUser = { username, email, password: hashedPassword };

  SignupService.insertNewUser(req.app.get("db"), newUser)
    .then((user) => {
      req.session.user = { username };
      console.log(user);
      res.send({ username });
    })
    .catch(next);
});

module.exports = signupRouter;
