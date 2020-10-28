const News = require("../models/news.model");

module.exports.all = (req, res, next) => {
  News.find({})
    .populate("parentId")
    .then((news) => res.status(200).json(news))
    .catch(next);
};

module.exports.new = (req, res, next) => {
  req.body.parentId = req.params.parentId;

  if (req.file) {
    req.body.image = req.file.url;
  }

  const news = new News(req.body);

  news
    .save()
    .then((news) => res.status(201).json(news))
    .catch(next);
};

module.exports.show = (req, res, next) => {
  News.findById(req.params.id)
    .then((news) => {
      console.log(news);
      res.status(200).json(news);
    })
    .catch(next);
};

module.exports.edit = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.url;
  }

  News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((news) => res.status(200).json(news))
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  News.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).json();
    })
    .catch(next);
};
