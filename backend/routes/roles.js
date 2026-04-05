var express = require("express");
var router = express.Router();
let roleController = require("../controllers/roles");


router.get("/", async function (req, res, next) {
    let roles = await roleController.GetAllRoles();
    res.send(roles);
});


router.get("/:id", async function (req, res, next) {
    try {
        let result = await roleController.GetRoleById(req.params.id);
        if (result) {
            res.send(result);
        }
        else {
            res.status(404).send({ message: "id not found" });
        }
    } catch (error) {
        res.status(404).send({ message: "id not found" });
    }
});


router.post("/", async function (req, res, next) {
    try {
        let newItem = await roleController.CreateRole(req.body);
        res.send(newItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.put("/:id", async function (req, res, next) {
    try {
        let updatedItem = await roleController.UpdateRole(req.params.id, req.body);
        if (!updatedItem) {
            return res.status(404).send({ message: "id not found" });
        }
        res.send(updatedItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        let updatedItem = await roleController.DeleteRole(req.params.id);
        if (!updatedItem) {
            return res.status(404).send({ message: "id not found" });
        }
        res.send(updatedItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

module.exports = router;