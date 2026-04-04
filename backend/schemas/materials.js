const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên chất liệu là bắt buộc"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    percentage: {
      type: Number,
      required: [true, "Phần trăm chất liệu là bắt buộc"],
      min: 0,
      max: 100,
    },
    care: {
      type: String,
      default: "",
    },
    priceModifier: {
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

module.exports = mongoose.model("material", materialSchema);
