var express = require("express");
var router = express.Router();
let materialController = require("../controllers/materials");
let { checkLogin, checkRole } = require("../utils/authHandler.js");
const { default: mongoose } = require("mongoose");

// GET all materials
router.get("/", async function (req, res, next) {
  try {
    let filters = {};
    if (req.query.isActive) {
      filters.isActive = req.query.isActive === "true";
    }
    let materials = await materialController.GetAllMaterials(filters);
    res.send(materials);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// GET material by ID
router.get("/:id", async function (req, res, next) {
  try {
    let material = await materialController.GetMaterialById(req.params.id);
    if (!material) {
      return res.status(404).send({ message: "Chất liệu không tồn tại" });
    }
    res.send(material);
  } catch (err) {
    res.status(404).send({ message: "ID không hợp lệ" });
  }
});

// CREATE new material (ADMIN/MODERATOR only)
router.post(
  "/",
  async function (req, res, next) {
    try {
      const { name, description, percentage, care, priceModifier } = req.body;

      if (!name || percentage === undefined) {
        return res.status(400).send({
          message: "Tên chất liệu và phần trăm là bắt buộc",
        });
      }

      let newMaterial = await materialController.CreateMaterial(
        name,
        description || "",
        percentage,
        care || "",
        priceModifier || 0,
      );

      res.send(newMaterial);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  },
);

// UPDATE material (ADMIN/MODERATOR only)
router.put(
  "/:id",
  checkLogin,
  checkRole("ADMIN", "MODERATOR"),
  async function (req, res, next) {
    try {
      let material = await materialController.GetMaterialById(req.params.id);
      if (!material) {
        return res.status(404).send({ message: "Chất liệu không tồn tại" });
      }

      let updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.percentage !== undefined)
        updateData.percentage = req.body.percentage;
      if (req.body.care) updateData.care = req.body.care;
      if (req.body.priceModifier !== undefined)
        updateData.priceModifier = req.body.priceModifier;
      if (req.body.isActive !== undefined)
        updateData.isActive = req.body.isActive;

      let updatedMaterial = await materialController.UpdateMaterial(
        req.params.id,
        updateData,
      );
      res.send(updatedMaterial);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  },
);

// DELETE material (ADMIN only - soft delete)
router.delete(
  "/:id",
  checkLogin,
  checkRole("ADMIN"),
  async function (req, res, next) {
    try {
      let material = await materialController.GetMaterialById(req.params.id);
      if (!material) {
        return res.status(404).send({ message: "Chất liệu không tồn tại" });
      }

      let deletedMaterial = await materialController.DeleteMaterial(
        req.params.id,
      );
      res.send(deletedMaterial);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  },
);

module.exports = router;
