const request = require("supertest");

const app = require("./server");
const User = require("../models/user.model");

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
  it("Create wa new Tutor", async () => {
    cleanApp = 1;
    const res = await request(app).post("/api/users/newTutor").send(tutor);
    expect(res.statusCode).toEqual(201);
    camper.tutorId = res.body.id;
  });

  it("Login", async () => {
    const { username, password } = tutor;
    const res = await request(app)
      .post("/api/users/login")
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
});