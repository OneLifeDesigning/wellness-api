const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [6, "Name needs at last 6 chars"],
    },
    edition: {
      type: String,
      default: "I",
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    campId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camp",
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

courseSchema.virtual("lessons", {
  ref: "Lesson",
  localField: "_id",
  foreignField: "courseId",
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
