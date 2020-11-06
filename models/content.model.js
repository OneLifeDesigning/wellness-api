const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [6, "Name needs at last 6 chars"],
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    type: {
      type: String,
      enum: ["comic", "meme"],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    monitorId: {
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

contentSchema.virtual("attachments", {
  ref: "Attachment",
  localField: "_id",
  foreignField: "parentId",
});

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
