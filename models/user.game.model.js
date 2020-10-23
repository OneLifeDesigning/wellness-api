const mongoose = require("mongoose");

const userGameSchema = new mongoose.Schema(
  {
    token: {
      type: String,
    },
    rating: {
      type: String,
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    score: {
      type: String,
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
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

userGameSchema.virtual("games", {
  ref: "Game",
  localField: "gameId",
  foreignField: "_id",
});

const UserGame = mongoose.model("UserGame", userGameSchema);

module.exports = UserGame;
