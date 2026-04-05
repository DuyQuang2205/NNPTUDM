let paymentModel = require("../schemas/payments");

module.exports = {
  GetPaymentsByUser: async function (userId) {
    return await paymentModel
      .find({ user: userId })
      .populate("user", "name email");
  },

  GetPaymentById: async function (id, userId) {
    return await paymentModel
      .findOne({ _id: id, user: userId })
      .populate("user", "name email");
  },

  CreatePayment: async function (payload, userId) {
    const payment = new paymentModel({ ...payload, user: userId });
    await payment.save();
    return await payment.populate("user", "name email");
  },

  UpdatePayment: async function (id, payload, userId) {
    return await paymentModel
      .findOneAndUpdate({ _id: id, user: userId }, payload, {
        new: true,
        runValidators: true,
      })
      .populate("user", "name email");
  },

  DeletePayment: async function (id, userId) {
    return await paymentModel.findOneAndDelete({ _id: id, user: userId });
  },
};
