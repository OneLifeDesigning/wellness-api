const Game = require("../models/game.model");
const UserGame = require("../models/user.game.model");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports.all = (req, res, next) => {
  Game.find({})
    .then((games) => res.status(200).json(games))
    .catch(next);
};

module.exports.new = (req, res, next) => {
  req.body.parentId = req.params.parentId;

  if (req.file) {
    req.body.image = req.file.url;
  }

  const game = new Game(req.body);

  game
    .save()
    .then((game) => res.status(201).json(game))
    .catch(next);
};

module.exports.show = (req, res, next) => {
  Game.findById(req.params.id)
    .populate("scores")
    .then((game) => res.status(200).json(game))
    .catch(next);
};
module.exports.edit = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.url;
  }

  Game.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((game) => res.status(200).json(game))
    .catch(next);
};

module.exports.start = (req, res, next) => {
  req.body.gameId = req.params.id;
  req.body.userId = req.currentUser.id;

  req.body.token = jwt.sign(
    { userneme: req.currentUser.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const userGame = new UserGame(req.body);

  userGame
    .save()
    .then((game) => res.status(201).json(game))
    .catch(next);
};

module.exports.complete = (req, res, next) => {
  const { rating, score, comment } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader && !authHeader.split(" ")[0] === "Bearer") {
    next(createError(403));
  }
  const token = authHeader.split(" ")[1];

  token === null && next(createError(401));

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, _) => {
    err && next(createError(403));
    UserGame.findOneAndUpdate(
      { token },
      { rating, score, comment, isCompleted: true },
      { new: true }
    )
      .then(() => res.status(201).json())
      .catch(next);
  });
};

module.exports.delete = (req, res, next) => {
  Game.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).json();
    })
    .catch(next);
};
