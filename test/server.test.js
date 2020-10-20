const request = require("supertest");
const app = require("./server");

describe("Users Endpoints", () => {
  it("Create a new Tutor", async () => {
    const body = {
      username: "Test",
      name: "Test",
      lastname: "Test",
      email: "test@test.com",
      password: 12345678,
      birthday: new Date(),
      terms: true,
      role: "tutor",
    };
    const res = await request(app).post("/api/users/newTutor").send(body);
    expect(res.statusCode).toEqual(201);
  });
});
