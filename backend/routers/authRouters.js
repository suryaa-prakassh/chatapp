const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const pool = require("../db");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  validateForm(req, res);
  bcrypt.compare(req.body.password);
  const potentialLogin = await pool.query(
    "SELECT id,username,passhash  FROM users u WHERE u.username =$1",
    [req.body.username]
  );
  if (potentialLogin.rowCount > 0) {
    const isSamePass = await bcrypt.compare(
      req.body.password,
      potentialLogin.rows[0].passhash
    );
    if (isSamePass) {
      //login
    } else {
      res.json({ loggedIn });
    }
  }
});
router.post("/signup", async (req, res) => {
  validateForm(req, res);
  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );
  if (existingUser.rowCount === 0) {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users(username,passhash) values($1,$2) RETURNING id,username",
      [req.body.username, hashedPass]
    );
    req.session.user = {
      username,
      id: newUserQuery.rows[0].id,
    };
    res.json({ loggedIn: true, username });
  } else {
    res.json({
      loggedIn: false,
      status: "Username taken",
    });
  }
});

module.exports = router;
