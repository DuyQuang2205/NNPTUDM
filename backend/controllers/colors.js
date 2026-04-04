let colorModel = require("../schemas/colors");

module.exports = {
  CreateColor: async function (name, hexCode, imageUrl = "") {
    let newColor = new colorModel({
      name: name,
      hexCode: hexCode,
      imageUrl: imageUrl,
    });
    await newColor.save();
    return newColor;
  },

  GetAllColors: async function (filters = {}) {
    let query = { isDeleted: false, ...filters };
    return await colorModel.find(query).sort({ name: 1 });
  },

  GetColorById: async function (id) {
    return await colorModel.findOne({ _id: id, isDeleted: false });
  },

  UpdateColor: async function (id, updateData) {
    return await colorModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true },
    );
  },

  UpdateColorStock: async function (id, quantity) {
    return await colorModel.findByIdAndUpdate(
      id,
      { stock: quantity, updatedAt: Date.now() },
      { new: true },
    );
  },

  DeleteColor: async function (id) {
    return await colorModel.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true },
    );
  },

  HardDeleteColor: async function (id) {
    return await colorModel.findByIdAndDelete(id);
  },
};
