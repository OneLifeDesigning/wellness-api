const mongoose = require("mongoose");

const campSchema = new mongoose.Schema(
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
    dateStart: {
      type: Date,
    },
    dateEnd: {
      type: Date,
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

campSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "campId",
});

const Camp = mongoose.model("Camp", campSchema);

module.exports = Camp;
