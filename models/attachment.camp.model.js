const mongoose = require("mongoose");

const attachmentCampSchema = new mongoose.Schema(
  {
    campId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camp",
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

attachmentCampSchema.virtual("attachments", {
  ref: "Attachment",
  localField: "attachmentId",
  foreignField: "_id",
});

const AttachmentCamp = mongoose.model("AttachmentCamp", attachmentCampSchema);

module.exports = AttachmentCamp;
