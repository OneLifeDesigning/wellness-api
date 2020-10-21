const request = require("supertest");
const User = require("../models/user.model");
const app = require("./server");

const tutor = {
  username: "TutorTest",
  name: "Tutor",
  lastname: "Test",
  email: "test@test.com",
  password: 12345678,
  birthday: new Date(),
  terms: true,
  role: "tutor",
};
const camper = {
  username: "CamperTest",
  name: "Camper",
  lastname: "Test",
  password: 12345678,
  birthday: new Date(),
  terms: true,
  role: "camper",
};

let cleanApp = 0;
let Cookies = null;

beforeEach(async () => {
  if (cleanApp === 0) {
    await User.deleteMany({});
  }
});

describe("Users Endpoints", () => {
  it("Create a new Tutor", async () => {
    cleanApp = 1;
    const res = await request(app).post("/api/users/newTutor").send(tutor);
    expect(res.statusCode).toEqual(201);
    camper.tutorId = res.body.id;
  });

  it("Login ", async () => {
    const { username, password } = tutor;
    const res = await request(app)
      .post("/api/login")
      .send({ username: username, password: password.toString() });
    Cookies = res.header["set-cookie"];
    expect(res.statusCode).toEqual(200);
  });

  it("Create a new Camper", async () => {
    const res = await request(app)
      .post("/api/users/newCamper")
      .set("Cookie", [Cookies])
      .send(camper);
    expect(res.statusCode).toEqual(201);
  });

  it("Logout ", async () => {
    const res = await request(app).post("/api/logout").set("Cookie", [Cookies]);
    expect(res.statusCode).toEqual(204);
  });
});
