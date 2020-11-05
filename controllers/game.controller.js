const Game = require("../models/game.model");
const UserGame = require("../models/user.game.model");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports.all = (req, res, next) => {
  Game.find({})
    .populate("lessonId")
    .populate("monitorId")
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
    .populate("lessonId")
    .populate("monitorId")
    .populate("scores")
    .then((game) => res.status(200).json(game))
    .catch(next);
};

module.exports.edit = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.url;
  }

  Game.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((game) => res.status(200).json(game))
    .catch(next);
};

module.exports.isStarted = (req, res, next) => {
  const gameId = req.params.id;
  const userId = req.currentUser.id;

  UserGame.find({ gameId, userId })
    .then((gameStarded) => {
      res.status(201).json(gameStarded);
    })
    .catch(next);
};

module.exports.start = (req, res, next) => {
  const gameId = req.params.id;
  const userId = req.currentUser.id;

  req.body.gameId = gameId;
  req.body.userId = userId;

  UserGame.findOneAndDelete({ gameId, userId })
    .then(() => {
      Game.findById(gameId)
        .then((gameSelected) => {
          req.body.token = jwt.sign(
            { userneme: req.currentUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "6h" }
          );

          const userGame = new UserGame(req.body);

          userGame
            .save()
            .then((game) =>
              res.status(201).json({
                redirectTo: gameSelected.url + "?token=" + game.token,
              })
            )
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.complete = (req, res, next) => {
  console.log(req.body);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next(createError(403));
    return;
  }
  if (!authHeader.split(" ")[0] === "Bearer") {
    next(createError(403));
    return;
  }
  const { rating, score, comment } = req.body;
  const token = authHeader.split(" ")[1];

  token === null && next(createError(401));

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, _) => {
    err && next(createError(403));
    UserGame.findOneAndUpdate(
      { token },
      { rating, score, comment, isCompleted: true },
      { new: true, runValidators: true }
    )
      .then(() => res.status(201).json())
      .catch(next);
  });
};

module.exports.findGame = (req, res, next) => {
  const token = req.params.token;
  UserGame.findOne({ token })
    .populate("gameId")
    .populate("userId")
    .then((userGame) => res.status(201).json(userGame))
    .catch(next);
};

// module.exports.complete = (req, res, next) => {
//   const { rating, score, comment } = req.body;
//   const authHeader = req.headers.authorization;
//   if (!authHeader && !authHeader.split(" ")[0] === "Bearer") {
//     next(createError(403));
//   }
//   const token = authHeader.split(" ")[1];

//   token === null && next(createError(401));

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, _) => {
//     err && next(createError(403));
//     UserGame.findOneAndUpdate(
//       { token },
//       { rating, score, comment, isCompleted: true },
//       { new: true, runValidators: true }
//     )
//       .then(() => res.status(201).json())
//       .catch(next);
//   });
// };

module.exports.delete = (req, res, next) => {
  Game.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).json();
    })
    .catch(next);
};
