const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
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

gameSchema.virtual("scores", {
  ref: "UserGame",
  localField: "_id",
  foreignField: "gameId",
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret.token;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
