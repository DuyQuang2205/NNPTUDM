var express = require("express");
var router = express.Router();
let productController = require("../controllers/products");


/* GET users listing. */
//localhost:3000/api/v1
router.get("/", async function (req, res, next) {
  try {
    let data = await productController.GetAllProducts();
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/store/options", async function (req, res, next) {
  try {
    let options = await productController.GetStoreOptions();
    res.send(options);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/:id/detail", async function (req, res, next) {
  try {
    let detail = await productController.GetProductDetail(req.params.id);
    if (!detail) {
      return res.status(404).send({ message: "ID not found" });
    }
    res.send(detail);
  } catch (error) {
    res.status(404).send({ message: "ID not found" });
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    let result = await productController.GetProductById(req.params.id);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "ID not found",
      });
    }
  } catch (error) {
    res.status(404).send({
      message: "ID not found",
    });
  }
});

router.post("/", async function (req, res, next) {
  try {
    let created = await productController.CreateProduct(req.body);
    res.status(201).send(created);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    let result = await productController.UpdateProduct(req.params.id, req.body);
    if (!result) {
      return res.status(404).send({ message: "ID not found" });
    }
    res.send(result);
  } catch (error) {
    res.status(404).send({
      message: "ID not found",
    });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let result = await productController.DeleteProduct(req.params.id);
    if (!result) {
      return res.status(404).send({ message: "ID not found" });
    }
    res.send(result);
  } catch (error) {
    res.status(404).send({
      message: "ID not found",
    });
  }
});
module.exports = router;
