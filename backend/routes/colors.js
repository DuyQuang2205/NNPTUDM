var express = require("express");
var router = express.Router();
let colorController = require("../controllers/colors");
let { checkLogin, checkRole } = require("../utils/authHandler.js");
let { uploadImage } = require("../utils/uploadHandler");
const { default: mongoose } = require("mongoose");

// GET all colors
router.get("/", async function (req, res, next) {
  try {
    let filters = {};
    if (req.query.isActive) {
      filters.isActive = req.query.isActive === "true";
    }
    let colors = await colorController.GetAllColors(filters);
    res.send(colors);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// GET color by ID
router.get("/:id", async function (req, res, next) {
  try {
    let color = await colorController.GetColorById(req.params.id);
    if (!color) {
      return res.status(404).send({ message: "Màu sắc không tồn tại" });
    }
    res.send(color);
  } catch (err) {
    res.status(404).send({ message: "ID không hợp lệ" });
  }
});

// CREATE new color (ADMIN/MODERATOR only)
router.post(
  "/",
  checkLogin,
  checkRole("ADMIN", "MODERATOR"),
  uploadImage.single("image"),
  async function (req, res, next) {
    try {
      const { name, hexCode } = req.body;
      let imageUrl = req.file ? req.file.path : "";

      if (!name || !hexCode) {
        if (req.file) {
          let fs = require("fs");
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).send({
          message: "Tên màu và mã màu HEX là bắt buộc",
        });
      }

      let newColor = await colorController.CreateColor(name, hexCode, imageUrl);

      res.send(newColor);
    } catch (err) {
      if (req.file) {
        let fs = require("fs");
        fs.unlinkSync(req.file.path);
      }
      res.status(400).send({ message: err.message });
    }
  },
);

// UPDATE color (ADMIN/MODERATOR only)
router.put(
  "/:id",
  checkLogin,
  checkRole("ADMIN", "MODERATOR"),
  uploadImage.single("image"),
  async function (req, res, next) {
    try {
      let color = await colorController.GetColorById(req.params.id);
      if (!color) {
        if (req.file) {
          let fs = require("fs");
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).send({ message: "Màu sắc không tồn tại" });
      }

      let updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.hexCode) updateData.hexCode = req.body.hexCode;
      if (req.file) {
        if (color.imageUrl) {
          let fs = require("fs");
          try {
            fs.unlinkSync(color.imageUrl);
          } catch (e) {}
        }
        updateData.imageUrl = req.file.path;
      }
      if (req.body.stock !== undefined) updateData.stock = req.body.stock;
      if (req.body.isActive !== undefined)
        updateData.isActive = req.body.isActive;

      let updatedColor = await colorController.UpdateColor(
        req.params.id,
        updateData,
      );
      res.send(updatedColor);
    } catch (err) {
      if (req.file) {
        let fs = require("fs");
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {}
      }
      res.status(400).send({ message: err.message });
    }
  },
);

// DELETE color (ADMIN only - soft delete)
router.delete(
  "/:id",
  checkLogin,
  checkRole("ADMIN"),
  async function (req, res, next) {
    try {
      let color = await colorController.GetColorById(req.params.id);
      if (!color) {
        return res.status(404).send({ message: "Màu sắc không tồn tại" });
      }

      let deletedColor = await colorController.DeleteColor(req.params.id);
      res.send(deletedColor);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  },
);

module.exports = router;
