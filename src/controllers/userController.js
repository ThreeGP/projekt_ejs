const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const {
  getAllUsers,
  addUser,
  findUserByUsername
} = require("../models/User");

const userRules = [
  body("username").trim().isLength({ min: 3 }).withMessage("Login ma mieć min 3 litery"),
  body("password").isLength({ min: 6 }).withMessage("Hasło ma mieć min 6 znaków"),
  body("role").trim().notEmpty().withMessage("Rola jest potrzebna")
];

async function listUsers(req, res, next) {
  try {
    const users = await getAllUsers();
    res.render("users/list", { title: "Użytkownicy", users });
  } catch (err) {
    next(err);
  }
}

function showNewUser(req, res) {
  res.render("users/new", { title: "Nowy użytkownik", errors: [], user: {} });
}

async function createUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("users/new", {
      title: "Nowy użytkownik",
      errors: errors.array(),
      user: req.body
    });
  }
  try {
    const existing = await findUserByUsername(req.body.username);
    if (existing) {
      const err = new Error("Taki login już istnieje");
      err.status = 400;
      throw err;
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    await addUser({
      username: req.body.username,
      passwordHash: hash,
      role: req.body.role
    });
    res.redirect("/users");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  userRules,
  listUsers,
  showNewUser,
  createUser
};
