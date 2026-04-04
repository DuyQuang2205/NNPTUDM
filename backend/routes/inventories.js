var express = require('express');
var router = express.Router();
let inventoryModel = require('../schemas/inventories')

router.get('/', async function (req, res, next) {
    let inventories = await inventoryModel.find({
    }).populate({
        path: 'product',
        select: 'title price'
    })
    res.send(inventories)
})

router.put('/:id', async function(req, res, next) {
    try {
        const inventoryId = req.params.id;
        const updateData = req.body;

        // Prevent product field from being updated
        if (updateData.product) {
            delete updateData.product;
        }

        const updatedInventory = await inventoryModel.findByIdAndUpdate(
            inventoryId,
            updateData,
            { new: true }
        );

        if (!updatedInventory) {
            return res.status(404).send({ message: "Inventory not found" });
        }

        res.send(updatedInventory);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.post('/', async function (req, res, next) {
    try {
        const { product, quantity } = req.body;

        // Check if inventory for this product already exists
        const existingInventory = await inventoryModel.findOne({ product: product });
        if (existingInventory) {
            return res.status(400).send({ message: 'Inventory for this product already exists.' });
        }

        const newInventory = new inventoryModel({
            product: product,
            stock: quantity || 0
        });

        await newInventory.save();
        res.status(201).send(newInventory);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
        const inventoryId = req.params.id;

        const deletedInventory = await inventoryModel.findByIdAndUpdate(
            inventoryId,
            { isDeleted: true },
            { new: true }
        );

        if (!deletedInventory) {
            return res.status(404).send({ message: "Inventory not found" });
        }

        res.send({ message: "Inventory successfully deleted" });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.post('/increase-stock', async function (req, res, next) {
    let { product, quantity } = req.body;
    let getProduct = await inventoryModel.findOne({
        product: product
    })
    console.log(getProduct);
    if (getProduct) {
        getProduct.stock += quantity;
        await getProduct.save()
        res.send(getProduct)
    } else {
        res.status(404).send({
            message: "Product not found"
        })
    }

})
router.post('/decrease-stock', async function (req, res, next) {
    let { product, quantity } = req.body;
    let getProduct = await inventoryModel.findOne({
        product: product
    })
    if (getProduct) {
        if (getProduct.stock >= quantity) {
            getProduct.stock -= quantity;
            await getProduct.save()
            res.send(getProduct)
        } else {
            res.status(404).send({
                message: "Product khong du so luong"
            })
        }
    } else {
        res.status(404).send({
            message: "Product not found"
        })
    }

})
module.exports = router;