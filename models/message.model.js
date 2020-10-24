const mongoose = require("mongoose");
const Notification = require("../models/notification.model");
const UserChat = require("../models/user.chat.model");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      required: [true, "Text is required"],
      trim: true,
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

messageSchema.pre("save", function (next) {
  UserChat.find({ chatId: this.chatId })
    .then((usersChats) => {
      usersChats.map(async (userChat) => {
        if (userChat.userId !== this.userId) {
          const notification = new Notification({
            chatId: this.chatId,
            userId: userChat.userId,
          });
          await notification
            .save()
            .then(() => next())
            .catch((err) => next(err));
        }
      });
      next();
    })
    .catch((err) => next(err));
});

messageSchema.virtual("attachment", {
  ref: "Attachment",
  localField: "_id",
  foreignField: "parentId",
});

messageSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
