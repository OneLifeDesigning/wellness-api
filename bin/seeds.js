require("dotenv").config();
require("../config/db.config");

const restoreDatabase = () => {
  return Promise.all([User.deleteMany()]);
};

const seeds = async () => {
  await restoreDatabase()
    .then(() => {
      // TODO:
    })
    .catch((err) => console.log(err));
};

seeds();
