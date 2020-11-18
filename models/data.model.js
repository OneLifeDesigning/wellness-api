const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    date: Date,
    hours: Number,
    consumition: Number,
    price: Number,
    cost: Number,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
