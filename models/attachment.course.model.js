const mongoose = require("mongoose");

const attachmentCourseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
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

attachmentCourseSchema.virtual("attachments", {
  ref: "Attachment",
  localField: "attachmentId",
  foreignField: "_id",
});

const AttachmentCourse = mongoose.model(
  "AttachmentCourse",
  attachmentCourseSchema
);

module.exports = AttachmentCourse;
