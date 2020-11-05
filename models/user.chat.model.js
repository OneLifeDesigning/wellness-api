const mongoose = require("mongoose");

const userChatSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
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
userChatSchema.virtual("participant", {
  ref: "Chat",
  localField: "chatId",
  foreignField: "_id",
});
const UserChat = mongoose.model("UserChat", userChatSchema);

module.exports = UserChat;
