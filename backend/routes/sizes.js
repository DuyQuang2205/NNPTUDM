var express = require("express");
var router = express.Router();
let sizeController = require("../controllers/sizes");
let { checkLogin, checkRole } = require("../utils/authHandler.js");
const { default: mongoose } = require("mongoose");

// GET all sizes
router.get("/", async function (req, res, next) {
  try {
    let filters = {};
    if (req.query.isActive) {
      filters.isActive = req.query.isActive === "true";
    }
    let sizes = await sizeController.GetAllSizes(filters);
    res.send(sizes);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// GET size by ID
router.get("/:id", async function (req, res, next) {
  try {
    let size = await sizeController.GetSizeById(req.params.id);
    if (!size) {
      return res.status(404).send({ message: "Size không tồn tại" });
    }
    res.send(size);
  } catch (err) {
    res.status(404).send({ message: "ID không hợp lệ" });
  }
});

// CREATE new size (ADMIN/MODERATOR only)
router.post(
  "/",
  checkLogin,
  checkRole("ADMIN", "MODERATOR"),
  async function (req, res, next) {
    try {
      const { name, description, measurements } = req.body;

      if (
        !name ||
        !measurements ||
        !measurements.bust ||
        !measurements.waist ||
        !measurements.hips ||
        !measurements.length
      ) {
        return res.status(400).send({
          message:
            "Tên size, measurements (bust, waist, hips, length) là bắt buộc",
        });
      }

      let newSize = await sizeController.CreateSize(
        name,
        description,
        measurements,
      );

      res.send(newSize);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  },
);

// UPDATE size (ADMIN/MODERATOR only)
router.put(
  "/:id",
  checkLogin,
  checkRole("ADMIN", "MODERATOR"),
  async function (req, res, next) {
    try {
      let size = await sizeController.GetSizeById(req.params.id);
      if (!size) {
        return res.status(404).send({ message: "Size không tồn tại" });
      }

      let updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.measurements)
        updateData.measurements = req.body.measurements;
      if (req.body.isActive !== undefined)
        updateData.isActive = req.body.isActive;

      let updatedSize = await sizeController.UpdateSize(
        req.params.id,
        updateData,
      );
      res.send(updatedSize);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  },
);

// DELETE size (ADMIN only - soft delete)
router.delete(
  "/:id",
  checkLogin,
  checkRole("ADMIN"),
  async function (req, res, next) {
    try {
      let size = await sizeController.GetSizeById(req.params.id);
      if (!size) {
        return res.status(404).send({ message: "Size không tồn tại" });
      }

      let deletedSize = await sizeController.DeleteSize(req.params.id);
      res.send(deletedSize);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  },
);

module.exports = router;
