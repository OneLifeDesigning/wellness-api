const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [6, "Name needs at last 6 chars"],
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
    type: {
      type: String,
    },
    courseId: {
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

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
