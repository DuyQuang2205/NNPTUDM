let materialModel = require("../schemas/materials");

module.exports = {
  CreateMaterial: async function (
    name,
    description,
    percentage,
    care,
    priceModifier = 0,
  ) {
    let newMaterial = new materialModel({
      name: name,
      description: description,
      percentage: percentage,
      care: care,
      priceModifier: priceModifier,
    });
    await newMaterial.save();
    return newMaterial;
  },

  GetAllMaterials: async function (filters = {}) {
    let query = { isDeleted: false, ...filters };
    return await materialModel.find(query).sort({ name: 1 });
  },

  GetMaterialById: async function (id) {
    return await materialModel.findOne({ _id: id, isDeleted: false });
  },

  UpdateMaterial: async function (id, updateData) {
    return await materialModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true },
    );
  },

  DeleteMaterial: async function (id) {
    return await materialModel.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true },
    );
  },

  HardDeleteMaterial: async function (id) {
    return await materialModel.findByIdAndDelete(id);
  },
};
