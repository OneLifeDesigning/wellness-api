const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const SALT_WORK_FACTOR = 10;

const generateRandomToken = () => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password needs at last 8 chars"],
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_PATTERN, "Email is invalid"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name needs at last 3 chars"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name needs at last 3 chars"],
      trim: true,
    },
    phone: {
      type: String,
      minlength: [9, "Phone needs at last 9 chars"],
      trim: true,
    },
    birthday: {
      type: Date,
      required: [true, "Birthday is required"],
    },
    address: {
      type: String,
      minlength: [10, "Address needs at last 3 chars"],
    },
    role: {
      type: String,
      enum: ["admin", "tutor", "camper", "monitor"],
      default: "tutor",
    },
    terms: {
      type: Boolean,
      required: [true, "Terms are required"],
    },
    avatar: {
      type: String,
    },
    activation: {
      active: {
        type: Boolean,
        default: false,
      },
      token: {
        type: String,
        default: generateRandomToken,
      },
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
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.virtual("campers", {
  ref: "User",
  localField: "_id",
  foreignField: "tutorId",
});

userSchema.virtual("camps", {
  ref: "UserCamp",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("lessons", {
  ref: "UserLesson",
  localField: "_id",
  foreignField: "userId",
});

userSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    bcrypt
      .genSalt(SALT_WORK_FACTOR)
      .then((salt) => {
        return bcrypt.hash(user.password, salt).then((hash) => {
          user.password = hash;
          next();
        });
      })
      .catch((error) => next(error));
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
