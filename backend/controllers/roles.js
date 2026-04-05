let roleModel = require("../schemas/roles");

module.exports = {
  GetAllRoles: async function () {
    return await roleModel.find({ isDeleted: false });
  },

  GetRoleById: async function (id) {
    return await roleModel.findOne({ _id: id, isDeleted: false });
  },

  CreateRole: async function ({ name, description }) {
    let newItem = new roleModel({ name, description });
    return await newItem.save();
  },

  UpdateRole: async function (id, updateData) {
    return await roleModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  },

  DeleteRole: async function (id) {
    return await roleModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  },
};
