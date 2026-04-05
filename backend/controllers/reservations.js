let reservationModel = require("../schemas/reservations");

module.exports = {
  GetReservationByUser: async function (userId) {
    return await reservationModel
      .findOne({ user: userId, status: { $ne: "cancelled" } })
      .populate("items.product");
  },

  CreateOrReplaceReservation: async function (userId, payload) {
    return await reservationModel.findOneAndUpdate(
      { user: userId },
      {
        ...payload,
        user: userId,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
  },

  UpdateReservationStatus: async function (id, status) {
    return await reservationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
  },
};
