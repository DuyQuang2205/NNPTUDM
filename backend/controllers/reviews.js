let reviewModel = require("../schemas/reviews");

module.exports = {
  CreateReview: async function (
    product,
    user,
    rating,
    title,
    comment,
    images = [],
  ) {
    let newReview = new reviewModel({
      product: product,
      user: user,
      rating: rating,
      title: title,
      comment: comment,
      images: images,
    });
    await newReview.save();
    return await newReview.populate(["product", "user"]);
  },

  GetReviewsByProduct: async function (productId, filters = {}) {
    let query = {
      product: productId,
      isDeleted: false,
      ...filters,
    };
    return await reviewModel
      .find(query)
      .populate("user", "fullName avatarUrl")
      .sort({ createdAt: -1 });
  },

  GetAllReviews: async function (filters = {}, admin = false) {
    let query = { isDeleted: false, ...filters };
    return await reviewModel
      .find(query)
      .populate(["product", "user"])
      .sort({ createdAt: -1 });
  },

  GetReviewById: async function (id) {
    return await reviewModel
      .findOne({ _id: id, isDeleted: false })
      .populate(["product", "user"]);
  },

  GetReviewsByUser: async function (userId) {
    return await reviewModel
      .find({ user: userId, isDeleted: false })
      .populate("product")
      .sort({ createdAt: -1 });
  },

  UpdateReview: async function (id, updateData) {
    return await reviewModel
      .findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: Date.now() },
        { new: true },
      )
      .populate(["product", "user"]);
  },

  ApproveReview: async function (id) {
    return await reviewModel
      .findByIdAndUpdate(
        id,
        { status: "approved", updatedAt: Date.now() },
        { new: true },
      )
      .populate(["product", "user"]);
  },

  RejectReview: async function (id) {
    return await reviewModel
      .findByIdAndUpdate(
        id,
        { status: "rejected", updatedAt: Date.now() },
        { new: true },
      )
      .populate(["product", "user"]);
  },

  DeleteReview: async function (id) {
    return await reviewModel.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true },
    );
  },

  MarkHelpful: async function (id) {
    return await reviewModel.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true },
    );
  },
};
