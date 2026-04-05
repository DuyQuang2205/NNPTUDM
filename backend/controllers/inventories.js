const inventoryModel = require("../schemas/inventories");

module.exports = {
  GetAllInventories: async function () {
    return await inventoryModel.find({}).populate({
      path: "product",
      select: "title price images category isDeleted",
    });
  },

  UpdateInventory: async function (inventoryId, updateData) {
    const payload = { ...updateData };
    if (payload.product) delete payload.product;

    return await inventoryModel.findByIdAndUpdate(inventoryId, payload, {
      new: true,
      runValidators: true,
    });
  },

  CreateInventory: async function ({ product, quantity }) {
    const existingInventory = await inventoryModel.findOne({ product });
    if (existingInventory) {
      throw new Error("Inventory for this product already exists.");
    }

    const newInventory = new inventoryModel({
      product,
      stock: Number(quantity || 0),
    });

    return await newInventory.save();
  },

  DeleteInventory: async function (inventoryId) {
    return await inventoryModel.findByIdAndUpdate(
      inventoryId,
      { isDeleted: true },
      { new: true },
    );
  },

  IncreaseStock: async function ({ product, quantity }) {
    const inv = await inventoryModel.findOne({ product, isDeleted: false });
    if (!inv) return null;

    inv.stock += Number(quantity || 0);
    return await inv.save();
  },

  DecreaseStock: async function ({ product, quantity }) {
    const inv = await inventoryModel.findOne({ product, isDeleted: false });
    if (!inv) return null;

    const qty = Number(quantity || 0);
    if (inv.stock < qty) {
      throw new Error("Product khong du so luong");
    }

    inv.stock -= qty;
    return await inv.save();
  },
};
