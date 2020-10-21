require("dotenv").config();
require("../config/db.config");
const faker = require("faker");
const User = require("../models/user.model");
const Camp = require("../models/camp.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const UserCamp = require("../models/usercamp.model");

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
    role: "tutor",
    terms: true,
  });

  if (tutorId.length !== 0) {
    user.role = "camper";
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

const createMonitor = () => {
  const user = new User({
    birthday: generateBirthday(getRandomArbitrary(38, 60)),
    address: generateAddress(),
    name: "Juan",
    lastname: "Martínez Ginés",
    email: "juanmagi@gamecamp.es",
    password: 12345678,
    username: "JuanMaGiCo",
    avatar: faker.image.avatar(),
    phone: faker.phone.phoneNumber(),
    activation: {
      active: true,
      token: generateRandomToken(),
    },
    role: "monitor",
    terms: true,
  });

  return user.save();
};
const createCamp = () => {
  let date = new Date();
  const camp = new Camp({
    name: faker.company.companyName(),
    edition: "I",
    description: faker.lorem.paragraph(),
    image: faker.image.imageUrl(),
    dateStart: date.setDate(date.getDate() + 20),
    dateEnd: date.setDate(date.getDate() + 10),
  });

  return camp.save();
};
const createCourse = (monitorId, campId) => {
  const course = new Course({
    name: faker.company.companyName(),
    edition: "I",
    description: faker.lorem.paragraph(),
    campId: campId,
    monitorId: monitorId,
  });

  return course.save();
};
const createLesson = async (monitorId, courseId, type, campStart) => {
  const lessonsArr = [];
  let start = new Date(campStart);
  for (let index = 1; index <= 10; index++) {
    const lesson = new Lesson({
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      image: faker.image.imageUrl(),
      content: faker.lorem.paragraphs(),
      dateStart: new Date(start.setDate(campStart.getDate() + index)),
      type: type,
      courseId: courseId,
      monitorId: monitorId,
    });
    lessonsArr.push(
      lesson
        .save()
        .then((lesson) => {
          return lesson._id;
        })
        .catch()
    );
  }
  return Promise.all(lessonsArr);
};

const createUserCamp = async (campers, campId) => {
  await campers.map((camper) => {
    const userCamp = new UserCamp({
      campId: campId,
      userId: camper,
    });
    userCamp.save();
  });
};

const restoreDatabase = () => {
  return Promise.all([
    User.deleteMany(),
    Camp.deleteMany(),
    Course.deleteMany(),
    Lesson.deleteMany(),
    UserCamp.deleteMany(),
  ]);
};

const campersArr = [];
const seeds = () => {
  restoreDatabase()
    .then(() => {
      createMonitor()
        .then((monitor) => {
          createCamp()
            .then(async (camp) => {
              createCourse(monitor.id, camp.id)
                .then(async (course) => {
                  await createLesson(
                    monitor.id,
                    course.id,
                    "Lesson",
                    camp.dateStart
                  )
                    .then(async (lessonsArr) => {
                      createTutors()
                        .then(async (tutorsArr) => {
                          for (
                            let index = 0;
                            index < tutorsArr.length;
                            index++
                          ) {
                            await createUser(tutorsArr[index])
                              .then((camper) => {
                                campersArr.push(camper.id);
                              })
                              .catch((err) => {
                                console.log(err);
                              });
                          }
                          createUserCamp(campersArr, camp.id);
                          console.log("Yarl");
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    })
                    .catch();
                })
                .catch();
            })
            .catch();
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch();
};

seeds();
