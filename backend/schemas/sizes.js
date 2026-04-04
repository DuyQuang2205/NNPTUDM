const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên size là bắt buộc"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    measurements: {
      bust: {
        type: Number,
        required: true,
        min: 0,
      },
      waist: {
        type: Number,
        required: true,
        min: 0,
      },
      hips: {
        type: Number,
        required: true,
        min: 0,
      },
      length: {
        type: Number,
        required: true,
        min: 0,
      },
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

module.exports = mongoose.model("size", sizeSchema);
