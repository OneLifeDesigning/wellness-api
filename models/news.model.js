const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [6, "Title needs at last 6 chars"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    content: {
      type: String,
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
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

newsSchema.virtual("attachments", {
  ref: "Attachment",
  localField: "_id",
  foreignField: "parentId",
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
