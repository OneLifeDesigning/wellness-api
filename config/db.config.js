const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wellness";
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then()
  .catch();

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});
