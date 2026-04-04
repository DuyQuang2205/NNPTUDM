var express = require("express");
var router = express.Router();
let { postUserValidator, validateResult } = require('../utils/validatorHandler')
let userController = require('../controllers/users')
let cartModel = require('../schemas/cart');
let { checkLogin, checkRole } = require('../utils/authHandler.js')
let { sendPasswordMail } = require('../utils/sendMailHandler')

let userModel = require("../schemas/users");
const { default: mongoose } = require("mongoose");
//- Strong password

router.get("/", checkLogin,
  checkRole("ADMIN", "MODERATOR"), async function (req, res, next) {
    let users = await userModel
      .find({ isDeleted: false })
      .populate({
        'path': 'role',
        'select': "name"
      })
    res.send(users);
  });

router.get("/:id", checkLogin, async function (req, res, next) {
  try {
    let result = await userModel
      .find({ _id: req.params.id, isDeleted: false })
    if (result.length > 0) {
      res.send(result);
    }
    else {
      res.status(404).send({ message: "id not found" });
    }
  } catch (error) {
    res.status(404).send({ message: "id not found" });
  }
});

router.post("/",  postUserValidator, validateResult,
  async function (req, res, next) {
    try {
      let newItem = await userController.CreateAnUser(
        req.body.username,
        req.body.password,
        req.body.email,
        req.body.role
      )
      let newCart = new cartModel({
        user: newItem._id
      })
      let result = await newCart.save()
      result = await result.populate('user')
      res.send(result)
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });

router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findById(id);
    for (const key of Object.keys(req.body)) {
      updatedItem[key] = req.body[key];
    }
    await updatedItem.save();

    if (!updatedItem) return res.status(404).send({ message: "id not found" });

    let populated = await userModel
      .findById(updatedItem._id)
    res.send(populated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).send({ message: "id not found" });
    }
    res.send(updatedItem);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Import user with random password and send email
router.post("/import-user/send-email", async function (req, res, next) {
  try {
    const { username, email, roleId, fullName, avatarUrl } = req.body;

    // Validate required fields
    if (!username || !email || !roleId) {
      return res.status(400).send({
        message: "Username, email, and roleId are required"
      });
    }

    // Check if username or email already exists
    const existingUser = await userModel.findOne({
      $or: [
        { username: username },
        { email: email }
      ],
      isDeleted: false
    });

    if (existingUser) {
      return res.status(400).send({
        message: "Username or email already exists"
      });
    }

    // Create user with random password
    const { user, plainPassword } = await userController.CreateUserWithRandomPassword(
      username,
      email,
      roleId,
      avatarUrl,
      fullName
    );

    // Create cart for user
    let newCart = new cartModel({
      user: user._id
    })
    await newCart.save()

    // Send email with password
    await sendPasswordMail(email, username, plainPassword);

    res.status(201).send({
      message: "User created successfully and password sent to email",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl
      },
      passwordSent: true,
      note: "Password has been sent to the user's email address"
    });

  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).send({
      message: err.message || "Error creating user"
    });
  }
});

module.exports = router;