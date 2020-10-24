const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [6, "Name needs at last 6 chars"],
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    content: {
      type: String,
    },
    dateStart: {
      type: Date,
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
lessonSchema.virtual("attachments", {
  ref: "Attachment",
  localField: "_id",
  foreignField: "parentId",
});
const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
