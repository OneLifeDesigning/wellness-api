const mongoose = require("mongoose");

const userCourseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
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

userCourseSchema.virtual("course", {
  ref: "Course",
  localField: "courseId",
  foreignField: "_id",
});

const UserCourse = mongoose.model("UserCourse", userCourseSchema);

module.exports = UserCourse;
