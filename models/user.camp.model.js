const mongoose = require("mongoose");

const userCampSchema = new mongoose.Schema(
  {
    campId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camp",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userCampSchema.virtual("camp", {
  ref: "Camp",
  localField: "campId",
  foreignField: "_id",
});

const UserCamp = mongoose.model("UserCamp", userCampSchema);

module.exports = UserCamp;
