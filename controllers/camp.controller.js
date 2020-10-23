const Camp = require("../models/camp.model");
const UserCamp = require("../models/user.camp.model");
const User = require("../models/user.model");

module.exports.all = (req, res, next) => {
  Camp.find({})
    .then((camps) => res.status(200).json(camps))
    .catch(next);
};

module.exports.new = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.url;
  }
  const camp = new Camp(req.body);

  camp
    .save()
    .then((camp) => res.status(201).json(camp))
    .catch(next);
};

module.exports.show = (req, res, next) => {
  const { id } = req.params;
  Camp.findById(id)
    .populate({
      path: "courses",
      model: "Course",
    })
    .populate({
      path: "attachments",
      model: "Attachment",
    })
    .then((camp) => res.status(200).json(camp))
    .catch(next);
};
module.exports.edit = (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    req.body.image = req.file.url;
  }
  Camp.findByIdAndUpdate(id, req.body, { new: true })
    .then((camp) => res.status(200).json(camp))
    .catch(next);
};
module.exports.enroll = (req, res, next) => {
  const campId = req.params.id;
  const userId = req.params.user;

  User.find({ tutorId: req.currentUser.id })
    .then((campers) => {
      campers.some((camper) => camper.id === userId)
        ? UserCamp.findOne({ campId, userId })
            .then((isEnrolled) => {
              if (isEnrolled) {
                res.status(204).json();
              } else {
                const userCamp = new UserCamp({ campId, userId });
                userCamp
                  .save()
                  .then(() => res.status(201).json())
                  .catch(next);
              }
            })
            .catch(() => {})
        : next();
    })
    .catch(next);
};
module.exports.disenroll = (req, res, next) => {
  const campId = req.params.id;
  const userId = req.params.user;
  UserCamp.findOneAndDelete({ campId, userId })
    .then(() => res.status(204).json())
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  const { id } = req.params;
  Camp.findByIdAndDelete(id)
    .then(() => {
      res.status(204).json();
    })
    .catch(next);
};
