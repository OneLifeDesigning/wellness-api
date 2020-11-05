const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slogan: {
      type: String,
      trim: true,
      maxlength: [120, "Slogan can not be greater than 120 characters"],
    },
    image: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
chatSchema.virtual("participants", {
  ref: "UserChat",
  localField: "_id",
  foreignField: "chatId",
});

chatSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "chatId",
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
