require("dotenv").config();
require("../config/db.config");
const faker = require("faker");
const Attachment = require("../models/attachment.model");
const Camp = require("../models/camp.model");
const Chat = require("../models/chat.model");
const Content = require("../models/content.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const Message = require("../models/message.model");
const News = require("../models/news.model");
const Notification = require("../models/notification.model");
const UserCamp = require("../models/user.camp.model");
const UserChat = require("../models/user.chat.model");
const User = require("../models/user.model");

const generateAddress = () => {
  return `${faker.address.streetAddress()}, ${faker.address.zipCode()}, ${faker.address.city()}, ${faker.address.country()}`;
};

const getRandomElementsArr = (arr, maxItems) => {
  const results = [];

  for (let index = 0; index < maxItems; index++) {
    const randItem = arr.sort(() => 0.5 - Math.random())[index];
    if (results.every((item) => item !== randItem)) {
      results.push(randItem);
    }
  }
  return results;
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
  let birthday = "";
  if (tutorId.length !== 0) {
    birthday = generateBirthday(getRandomArbitrary(12, 18));
  } else {
    birthday = generateBirthday(getRandomArbitrary(38, 60));
  }
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

const createCourses = (monitorId, campId) => {
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
        .then(async (course) => {
          const { id } = course;
          await createAttachment(id);
          await createNews(id);
          return id;
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

const createContents = async (monitorId, coursesArr) => {
  const contentsArr = [];
  const contentTypes = ["comic", "memes"];
  for (let z = 0; z <= coursesArr.length; z++) {
    for (let m = 0; m <= contentTypes.length; m++) {
      for (let index = 0; index < 4; index++) {
        const content = new Content({
          name: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          image: faker.image.imageUrl(),
          type: coursesArr[m],
          courseId: coursesArr[z],
          monitorId,
        });
        contentsArr.push(
          content
            .save()
            .then((content) => {
              for (let index = 0; index < Math.floor(Math.random(3)); index++) {
                createAttachment(content._id);
              }
              return content._id;
            })
            .catch()
        );
      }
    }
  }
  return Promise.all(contentsArr);
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

const createAttachment = (parentId) => {
  const attachment = new Attachment({
    name: faker.random.words(),
    description: faker.lorem.paragraph(),
    type: faker.system.fileType(),
    url: faker.system.filePath(),
    parentId,
  });
  return attachment.save();
};

const createNews = (parentId) => {
  const news = new News({
    title: faker.lorem.words(),
    subtitle: faker.lorem.sentence(),
    image: faker.image.imageUrl(),
    content: faker.lorem.paragraphs(),
    parentId,
  });
  return news.save();
};

const createChat = async (campers, monitorId) => {
  await campers.map((userId) => {
    const chat = new Chat({
      name: faker.lorem.words(),
      slogan: faker.lorem.sentence(),
      image: faker.image.imageUrl(),
      userId,
    });
    chat
      .save()
      .then((chat) => {
        const participants = getRandomElementsArr(
          campers.filter((uId) => uId !== userId),
          Math.floor(Math.random() * campers.length)
        );
        participants.map((participant) => {
          const userChat = new UserChat({
            chatId: chat.id,
            userId: participant.id,
          });
          userChat
            .save()
            .then(() => {
              for (
                let index = 0;
                index < Math.floor(Math.random() * 10);
                index++
              ) {
                setTimeout(() => {
                  const message = new Message({
                    chatId: chat.id,
                    userId: participant.id,
                    text: faker.lorem.sentence(),
                  });
                  message
                    .save()
                    .then((msg) => {
                      console.log(
                        `Msg crreated ${msg.text} in ${Math.floor(
                          Math.random(1000) * 10
                        )}`
                      );
                    })
                    .catch();
                }, Math.floor(Math.random(1000) * 1000));
              }
            })
            .catch(() => {});
        });
      })
      .catch();
  });
};

const restoreDatabase = () => {
  return Promise.all([
    User.deleteMany(),
    Camp.deleteMany(),
    Course.deleteMany(),
    Lesson.deleteMany(),
    Content.deleteMany(),
    UserCamp.deleteMany(),
    Attachment.deleteMany(),
    News.deleteMany(),
    Notification.deleteMany(),
    Chat.deleteMany(),
    Message.deleteMany(),
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
              createCourses(monitor.id, camp.id)
                .then(async (courses) => {
                  await createLessons(monitor.id, camp.dateStart, courses)
                    .then(async () => {
                      await createContents(monitor.id, courses)
                        .then(async () => {
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
                                  .catch((err) => console.log(err));
                              }
                              await createChat(campersArr, monitor.id);
                              await createUserCamp(campersArr, camp.id);
                              console.log("Yarl");
                            })
                            .catch((err) => console.log(err));
                        })
                        .catch((err) => console.log(err));
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

seeds();
