const mongoose = require("mongoose");
const Lesson = require("../models/lesson.model");
const Notification = require("../models/notification.model");

const userLessonSchema = new mongoose.Schema(
  {
    isCompleted: {
      type: Boolean,
      default: false,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
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

userLessonSchema.pre("save", function (next) {
  Lesson.findById(this.lessonId)
    .then((lesson) => {
      const notification = new Notification({
        parentId: this.lessonId,
        userId: lesson.monitorId,
      });
      notification
        .save()
        .then(() => next())
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

userLessonSchema.virtual("lesson", {
  ref: "Lesson",
  localField: "lessonId",
  foreignField: "_id",
});

const UserLesson = mongoose.model("UserLesson", userLessonSchema);

module.exports = UserLesson;
