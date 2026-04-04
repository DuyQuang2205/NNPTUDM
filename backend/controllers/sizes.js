let sizeModel = require("../schemas/sizes");

module.exports = {
  CreateSize: async function (name, description, measurements) {
    let newSize = new sizeModel({
      name: name,
      description: description,
      measurements: measurements,
    });
    await newSize.save();
    return newSize;
  },

  GetAllSizes: async function (filters = {}) {
    let query = { isDeleted: false, ...filters };
    return await sizeModel.find(query).sort({ name: 1 });
  },

  GetSizeById: async function (id) {
    return await sizeModel.findOne({ _id: id, isDeleted: false });
  },

  UpdateSize: async function (id, updateData) {
    return await sizeModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true },
    );
  },

  DeleteSize: async function (id) {
    return await sizeModel.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true },
    );
  },

  HardDeleteSize: async function (id) {
    return await sizeModel.findByIdAndDelete(id);
  },
};
