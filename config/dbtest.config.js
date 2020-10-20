const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/testgc";

beforeEach((done) => {
  mongoose.connect(
    MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    () => done()
  );
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => {
      done();
    });
  });
});
