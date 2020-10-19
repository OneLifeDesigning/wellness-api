require("dotenv").config();
require("../config/db.config");
const faker = require("faker");
const User = require("../models/user.model");

const generateAddress = () => {
  return `${faker.address.streetAddress()}, ${faker.address.zipCode()}, ${faker.address.city()}, ${faker.address.country()}`;
};

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const generateBirthday = (age) => {
  const year = new Date().getFullYear() - age;
  return randomDate(new Date(year, 1, 1), new Date(year, 12, 31));
};

const generateRandomToken = () => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

const createUser = (tutorId) => {
  const birthday =
    tutorId.length !== 0
      ? generateBirthday(getRandomArbitrary(12, 18))
      : generateBirthday(getRandomArbitrary(38, 60));
  const user = new User({
    birthday: birthday,
    address: generateAddress(),
    name: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 12345678,
    username: faker.internet.userName(),
    avatar: faker.image.avatar(),
    phone: faker.phone.phoneNumber(),
    activation: {
      active: true,
      token: generateRandomToken(),
    },
    role: "test",
    terms: true,
  });

  if (tutorId.length !== 0) {
    user.tutorId = tutorId;
  }

  return user.save();
};

const createTutors = () => {
  const tutorArr = [];
  for (let index = 0; index < 13; index++) {
    tutorArr.push(
      createUser("")
        .then((user) => {
          return user._id;
        })
        .catch()
    );
  }
  return Promise.all(tutorArr);
};

function restoreDatabase() {
  return Promise.all([User.deleteMany()]);
}
function seeds() {
  restoreDatabase()
    .then(() => {
      createTutors()
        .then((results) => {
          for (let index = 0; index < results.length; index++) {
            createUser(results[index])
              .then((user) => {
                console.log(user.userName);
              })
              .catch();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch();
}

seeds();