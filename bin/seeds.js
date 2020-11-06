require("dotenv").config();
require("../config/db.config");
const faker = require("faker");

const Attachment = require("../models/attachment.model");
const Camp = require("../models/camp.model");
const Chat = require("../models/chat.model");
const Content = require("../models/content.model");
const Course = require("../models/course.model");
const Game = require("../models/game.model");
const Lesson = require("../models/lesson.model");
const Message = require("../models/message.model");
const News = require("../models/news.model");
const Notification = require("../models/notification.model");
const UserCamp = require("../models/user.camp.model");
const UserChat = require("../models/user.chat.model");
const UserCourse = require("../models/user.course.model");
const UserGame = require("../models/user.game.model");
const UserLesson = require("../models/user.lesson.model");
const User = require("../models/user.model");

const generateAddress = () => {
  return `${faker.address.streetAddress()}, ${faker.address.zipCode()}, ${faker.address.city()}, ${faker.address.country()}`;
};

const getRandomElements = (arr, maxItems) => {
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
  const tutor = [];
  for (let index = 0; index < 13; index++) {
    tutor.push(
      createUser("")
        .then((user) => {
          return user._id;
        })
        .catch()
    );
  }
  return Promise.all(tutor);
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
    image: faker.image.image(),
    startDate: date.setDate(date.getDate()),
    endDate: date.setDate(date.getDate() + 10),
  });

  return camp.save();
};

const createCourses = (monitorId, campId) => {
  const courses = [];
  for (let target = 12; target <= 18; target++) {
    const course = new Course({
      name: faker.company.companyName(),
      edition: "2020",
      description: faker.lorem.paragraph(),
      image: faker.image.image(),
      campId: campId,
      target,
      monitorId: monitorId,
    });
    courses.push(
      course
        .save()
        .then(async (course) => {
          const { id } = course;
          await createAttachment(course.id, "Course");
          await createNews(course.id, "Course");
          return id;
        })
        .catch()
    );
  }
  return Promise.all(courses);
};

const createLessons = async (monitorId, campStart, courses) => {
  const lessons = [];
  let start = new Date(campStart);
  for (let z = 0; z < courses.length; z++) {
    for (let index = 0; index < 10; index++) {
      const lesson = new Lesson({
        name: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        image: faker.image.image(),
        content: faker.lorem.paragraphs(4),
        startDate: new Date(start.setDate(campStart.getDate() + index)),
        courseId: courses[z],
        monitorId,
      });
      lessons.push(
        lesson
          .save()
          .then(async (lesson) => {
            for (let index = 0; index < Math.floor(Math.random(3)); index++) {
              await createAttachment(lesson.id, "Lesson");
              await createNews(id, "Lesson");
            }
            return lesson._id;
          })
          .catch()
      );
    }
  }
  return Promise.all(lessons);
};

const createContents = async (monitorId, courses) => {
  const contents = [];
  const contentTypes = ["comic", "meme"];
  for (let z = 0; z < courses.length; z++) {
    for (let m = 0; m < contentTypes.length; m++) {
      for (let index = 0; index < 2; index++) {
        const num = Math.random() >= 0.5 ? 1 : 0;
        const content = new Content({
          name: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          image: faker.image.image(),
          type: contentTypes[num],
          courseId: courses[z],
          monitorId,
        });
        contents.push(
          content
            .save()
            .then(async (content) => {
              await createAttachment(content.id, "Content");
              await createNews(content.id, "Content");
              return content.id;
            })
            .catch()
        );
      }
    }
  }
  return Promise.all(contents);
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

const createAttachment = (parentId, parentModel) => {
  const attachment = new Attachment({
    name: faker.random.words(),
    description: faker.lorem.paragraph(),
    type: faker.system.fileType(),
    url: faker.random.image(),
    parentId,
    onModel: parentModel,
  });
  return attachment.save();
};

const createGames = async (lessons, monitorId) => {
  const games = [];
  const contentTypes = ["videogame", "trivia", "couples", "diferences"];
  for (let i = 0; i < lessons.length; i++) {
    const game = new Game({
      name: faker.random.words(),
      description: faker.lorem.paragraph(),
      image: faker.image.image(),
      type: contentTypes[Math.floor(Math.random() * contentTypes.length)],
      url:
        "file:///Users/ajdc/Sites/ironhack/projects/gamecamp/games/r-type/index.html",
      lessonId: lessons[i],
      monitorId,
    });
    games.push(
      game
        .save()
        .then(async (game) => {
          await createAttachment(game.id, "Game");
          await createNews(game.id, "Game");
          return game.id;
        })
        .catch()
    );
  }
  return Promise.all(games);
};

const createNews = (parentId, parentModel) => {
  const news = new News({
    name: faker.lorem.words(),
    subtitle: faker.lorem.sentence(),
    image: faker.image.image(),
    content: faker.lorem.paragraphs(),
    parentId,
    onModel: parentModel,
  });
  return news.save();
};

const createChat = async (campers, monitorId) => {
  campers.push(monitorId);
  await campers.map((userId) => {
    const chat = new Chat({
      name: faker.lorem.words(),
      slogan: faker.lorem.sentence(),
      image: faker.image.image(),
      userId,
    });
    chat
      .save()
      .then((chat) => {
        const participants = getRandomElements(
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
                      console.log(`Msg created ${msg.text}`);
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
    Attachment.deleteMany(),
    Camp.deleteMany(),
    Chat.deleteMany(),
    Content.deleteMany(),
    Course.deleteMany(),
    Game.deleteMany(),
    Lesson.deleteMany(),
    Message.deleteMany(),
    News.deleteMany(),
    Notification.deleteMany(),
    UserCamp.deleteMany(),
    UserChat.deleteMany(),
    UserCourse.deleteMany(),
    UserGame.deleteMany(),
    UserLesson.deleteMany(),
    User.deleteMany(),
    createAdmin(),
  ]);
};

const campers = [];
const seeds = async () => {
  await restoreDatabase()
    .then(() => {
      createMonitor()
        .then((monitor) => {
          createCamp()
            .then(async (camp) => {
              createAttachment(camp._id, "Camp");
              createCourses(monitor.id, camp.id)
                .then(async (courses) => {
                  await createLessons(monitor.id, camp.startDate, courses)
                    .then(async (lessons) => {
                      await createGames(lessons, monitor.id)
                        .then(async () => {
                          await createContents(monitor.id, courses)
                            .then(async () => {
                              createTutors()
                                .then(async (tutors) => {
                                  for (
                                    let index = 0;
                                    index < tutors.length;
                                    index++
                                  ) {
                                    await createUser(tutors[index])
                                      .then((camper) => {
                                        campers.push(camper.id);
                                      })
                                      .catch((err) => console.log(err));
                                  }
                                  // await createChat(campers, monitor.id)
                                  await createUserCamp(campers, camp.id);
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
    })
    .catch((err) => console.log(err));
};

seeds();
