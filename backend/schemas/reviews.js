const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Đánh giá là bắt buộc"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Tiêu đề đánh giá là bắt buộc"],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, "Bình luận là bắt buộc"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("review", reviewSchema);
