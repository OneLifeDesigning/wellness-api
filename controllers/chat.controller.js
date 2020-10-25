const Chat = require("../models/chat.model");
const UserChat = require("../models/user.chat.model");
const Message = require("../models/message.model");
const Notification = require("../models/notification.model");

const addParticipantsToChat = (chatId, participantsArr) => {
  return Promise.all(
    participantsArr.map((userId) => {
      UserChat.findOne({ userId, chatId })
        .then((found) => {
          if (!found) {
            const newParticipant = new UserChat({
              userId,
              chatId,
            });

            newParticipant.save().then().catch();
          }
        })
        .catch();
    })
  );
};

const deleteParticipantsToChat = (chatId, participantsArr) => {
  return Promise.all(
    participantsArr.map((userId) => {
      UserChat.findOneAndDelete({ userId, chatId }).then().catch();
    })
  );
};

module.exports.all = (req, res, next) => {
  UserChat.find({ userId: req.currentUser.id })
    .then((chats) => res.status(200).json(chats))
    .catch(next);
};

module.exports.show = (req, res, next) => {
  Chat.findById(req.params.id)
    .populate("messages")
    .populate({
      path: "participants",
      options: { select: { userId: 1 } },
    })
    .then((chat) => res.status(200).json(chat))
    .catch(next);
};

module.exports.new = (req, res, next) => {
  req.body.userId = req.currentUser.id;

  if (req.file) {
    req.body.image = req.file.url;
  }

  const chat = new Chat(req.body);

  chat
    .save()
    .then((chat) => {
      addParticipantsToChat(chat.id, req.body.participants)
        .then(() => res.status(201).json(chat))
        .catch(next);
    })
    .catch(next);
};

module.exports.newMessage = (req, res, next) => {
  req.body.chatId = req.params.id;
  req.body.userId = req.currentUser.id;

  const message = new Message(req.body);

  message
    .save()
    .then((message) => {
      res.status(201).json(message);
    })
    .catch(next);
};

module.exports.addParticipants = (req, res, next) => {
  addParticipantsToChat(req.params.id, req.body.participants)
    .then(() => res.status(201).json())
    .catch(next);
};

module.exports.deleteParticipants = (req, res, next) => {
  deleteParticipantsToChat(req.params.id, req.body.participants)
    .then(() => res.status(204).json())
    .catch(next);
};

module.exports.getNotifications = (req, res, next) => {
  Notification.find({ userId: req.currentUser.id })
    .populate("chat")
    .then((notifications) => res.status(200).json(notifications))
    .catch(next);
};

module.exports.deleteNotification = (req, res, next) => {
  Notification.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).json())
    .catch(next);
};
