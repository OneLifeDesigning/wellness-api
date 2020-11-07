const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Notification = require("../models/notification.model");

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
      required: [true, "Usuario es requerido"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Contraseña es requerida"],
      minlength: [6, "Contraseña debe ser mayor de 6 caractéres"],
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      lowercase: true,
      match: [EMAIL_PATTERN, "Email no es válido"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Nombre es requerido"],
      minlength: [2, "Name needs at last 3 chars"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Nombre debe ser mayor de 3 caractéres"],
      trim: true,
    },
    phone: {
      type: String,
      minlength: [9, "Teléfono debe ser mayor de 9 caractéres"],
      trim: true,
    },
    birthday: {
      type: Date,
      required: [true, "Nacimiento  es requerido"],
    },
    address: {
      type: String,
      minlength: [10, "Dirección debe ser mayor de 3 caractéres"],
    },
    role: {
      type: String,
      enum: ["admin", "tutor", "camper", "monitor"],
      default: "tutor",
    },
    terms: {
      type: Boolean,
      required: [true, "Debés aceptar los términos y condiciones"],
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
    toObject: {
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

userSchema.virtual("courses", {
  ref: "UserCourse",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("lessons", {
  ref: "UserLesson",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("games", {
  ref: "UserGame",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("participants", {
  ref: "UserChat",
  localField: "_id",
  foreignField: "userId",
});

userSchema.pre("save", function (next) {
  const user = this;

  if (user.tutorId) {
    const notification = new Notification({
      msg: `Wellcome ${user.name} ${user.lastname}`,
      parentId: user.id,
      onModel: "User",
      userId: user.id,
    });
    notification
      .save()
      .then(() => {
        const notification = new Notification({
          msg: `Created successfully ${user.name} ${user.lastname}`,
          parentId: user.tutorId,
          onModel: "User",
          userId: user.tutorId,
        });
        notification
          .save()
          .then(() => {
            next();
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  } else {
    const notification = new Notification({
      msg: `Wellcome ${user.name} ${user.lastname}`,
      parentId: user.id,
      onModel: "User",
      userId: user.id,
    });
    notification
      .save()
      .then(() => {
        next();
      })
      .catch((err) => next(err));
  }

  if (user.isModified("password") && user.password !== "") {
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
