const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    isReaded: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "onModel",
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Camp", "Course", "Lesson", "Game", "News", "Content", "Chat"],
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

notificationSchema.virtual("parent", {
  ref: ["Camp", "Course", "Lesson", "Game", "News", "Content", "Chat"],
  localField: "parentId",
  foreignField: "_id",
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
