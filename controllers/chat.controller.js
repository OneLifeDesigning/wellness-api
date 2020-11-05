const Chat = require("../models/chat.model");
const UserChat = require("../models/user.chat.model");
const Message = require("../models/message.model");
const Notification = require("../models/notification.model");

const addParticipantsToChat = (chatId, participantsArr) => {
  return Promise.all(
    participantsArr.map((userId) => {
      UserChat.findOne({ userId, chatId })
        .then((found) => {
          if (found) {
            return;
          }
          const newParticipant = new UserChat({
            userId,
            chatId,
          });
          newParticipant.save().then().catch();
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
  Chat.find({ userId: req.currentUser.id })
    .then((chats) => res.status(200).json(chats))
    .catch(next);
};

module.exports.show = (req, res, next) => {
  Chat.findById(req.params.id)
    .populate({
      path: "participants",
      model: "UserChat",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .populate({
      path: "messages",
      model: "Message",
      populate: {
        path: "userId",
        model: "User",
      },
    })
    .then((chat) => res.status(200).json(chat))
    .catch(next);
};

module.exports.new = (req, res, next) => {
  req.body.userId = req.currentUser.id;

  if (req.file) {
    req.body.image = req.file.url;
  }

  req.body.participants = [...req.body.participants, req.currentUser.id];
  const chat = new Chat(req.body);

  chat
    .save()
    .then(async (chat) => {
      await addParticipantsToChat(chat.id, req.body.participants)
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
      Message.findById(message.id)
        .populate("userId")
        .then((msg) => {
          res.status(201).json(msg);
        })
        .catch(next);
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
