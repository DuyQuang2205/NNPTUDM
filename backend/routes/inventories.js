var express = require("express");
var router = express.Router();
let inventoryController = require("../controllers/inventories");

router.get("/", async function (req, res, next) {
    try {
        let inventories = await inventoryController.GetAllInventories();
        res.send(inventories);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.put("/:id", async function (req, res, next) {
    try {
        const updatedInventory = await inventoryController.UpdateInventory(
            req.params.id,
            req.body,
        );

        if (!updatedInventory) {
            return res.status(404).send({ message: "Inventory not found" });
        }

        res.send(updatedInventory);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.post("/", async function (req, res, next) {
    try {
        const newInventory = await inventoryController.CreateInventory(req.body);
        res.status(201).send(newInventory);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        const deletedInventory = await inventoryController.DeleteInventory(req.params.id);

        if (!deletedInventory) {
            return res.status(404).send({ message: "Inventory not found" });
        }

        res.send({ message: "Inventory successfully deleted" });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.post("/increase-stock", async function (req, res, next) {
    try {
        let updated = await inventoryController.IncreaseStock(req.body);
        if (!updated) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.send(updated);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.post("/decrease-stock", async function (req, res, next) {
    try {
        let updated = await inventoryController.DecreaseStock(req.body);
        if (!updated) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.send(updated);
    } catch (error) {
        const status = error.message === "Product khong du so luong" ? 400 : 500;
        res.status(status).send({ message: error.message });
    }
});
module.exports = router;