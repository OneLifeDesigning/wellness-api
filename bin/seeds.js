require("dotenv").config();
require("../config/db.config");
const faker = require("faker");
const User = require("../models/user.model");
const Camp = require("../models/camp.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const Attachment = require("../models/attachment.model");
const AttachmentCourse = require("../models/attachment.course.model");
const UserCamp = require("../models/user.camp.model");

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
    name: "Monitor",
    lastname: "Test",
    email: "monitor@gamecamp.es",
    password: 12345678,
    username: "MonitorTest",
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
const createAdmin = () => {
  const user = new User({
    birthday: generateBirthday(getRandomArbitrary(38, 60)),
    address: generateAddress(),
    name: "Admin",
    lastname: "Test",
    email: "admin@gamecamp.es",
    password: 12345678,
    username: "Admin",
    avatar: faker.image.avatar(),
    phone: faker.phone.phoneNumber(),
    activation: {
      active: true,
      token: generateRandomToken(),
    },
    role: "admin",
    terms: true,
  });

  user.save();
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
  const coursesArr = [];
  for (let target = 12; target <= 18; target++) {
    const course = new Course({
      name: faker.company.companyName(),
      edition: "2020",
      description: faker.lorem.paragraph(),
      campId: campId,
      target,
      monitorId: monitorId,
    });
    coursesArr.push(
      course
        .save()
        .then((course) => {
          createAttachment(course._id);
          return course._id;
        })
        .catch()
    );
  }
  return Promise.all(coursesArr);
};
const createLessons = async (monitorId, campStart, coursesArr) => {
  const lessonsArr = [];
  let start = new Date(campStart);
  for (let z = 0; z <= coursesArr.length; z++) {
    for (let index = 0; index < 10; index++) {
      const lesson = new Lesson({
        name: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        image: faker.image.imageUrl(),
        content: faker.lorem.paragraphs(),
        dateStart: new Date(start.setDate(campStart.getDate() + index)),
        type: "Lesson",
        courseId: coursesArr[z],
        monitorId,
      });
      lessonsArr.push(
        lesson
          .save()
          .then((lesson) => {
            for (let index = 0; index < Math.floor(Math.random(3)); index++) {
              createAttachment(lesson._id);
            }
            return lesson._id;
          })
          .catch()
      );
    }
  }
  return Promise.all(lessonsArr);
};

const createUserCamp = async (campers, campId) => {
  await campers.map((userId) => {
    const userCamp = new UserCamp({
      campId,
      userId,
    });
    userCamp.save();
  });
};

const createAttachment = (courseId) => {
  const attachment = new Attachment({
    name: faker.system.fileName(),
    description: faker.lorem.paragraph(),
    type: faker.system.fileType(),
    url: faker.system.filePath(),
    parentId: courseId,
  });
  return attachment.save();
};

const restoreDatabase = () => {
  return Promise.all([
    User.deleteMany(),
    Camp.deleteMany(),
    Course.deleteMany(),
    Lesson.deleteMany(),
    UserCamp.deleteMany(),
    createAdmin(),
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
              createAttachment(camp._id);
              createCourse(monitor.id, camp.id)
                .then(async (courses) => {
                  await createLessons(monitor.id, camp.dateStart, courses)
                    .then(async (lessons) => {
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
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

seeds();
