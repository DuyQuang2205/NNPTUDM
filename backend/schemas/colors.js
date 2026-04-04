const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên màu là bắt buộc"],
      unique: true,
      trim: true,
    },
    hexCode: {
      type: String,
      required: [true, "Mã màu HEX là bắt buộc"],
      match: [/^#[0-9A-F]{6}$/i, "Mã màu không hợp lệ"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("color", colorSchema);
