const mongoose = require("mongoose");

const attachmentLessonSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    attachmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
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

const AttachmentLesson = mongoose.model(
  "AttachmentLesson",
  attachmentLessonSchema
);

module.exports = AttachmentLesson;
