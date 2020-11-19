const request = require("supertest");
const Data = require("../models/data.model");
const app = require("./server");

const dataDemo = {
  date: "2019-01-30T23:00:00.000Z",
  hours: 23,
  consumition: 1323,
  price: 0.065330747,
  cost: 0.086432578281,
};

let cleanApp = 0;

beforeEach(async () => {
  if (cleanApp === 0) {
    await Data.deleteMany({});
  }
});

describe("Data Endpoints", () => {
  it("Create new", async () => {
    cleanApp = 1;
    const res = await request(app).post("/data").send(dataDemo);
    expect(res.statusCode).toEqual(201);
  });
});
