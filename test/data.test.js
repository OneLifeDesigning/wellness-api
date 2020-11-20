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
let dataReturned = null;
let cleanApp = 0;

beforeEach(async () => {
  if (cleanApp === 0) {
    await Data.deleteMany({});
  }
});

describe("Data Endpoints", () => {
  cleanApp = 1;
  it("Create", async () => {
    const res = await request(app).post("/data").send(dataDemo);
    dataReturned = res.body;
    expect(res.statusCode).toEqual(201);
  });
  it("Read", async () => {
    const res = await request(app).get("/data");
    expect(res.statusCode).toEqual(200);
  });
  it("Update", async () => {
    const res = await request(app)
      .patch(`/data/${dataReturned.id}`)
      .send({ hours: 22 });
    expect(res.statusCode).toEqual(200);
  });
  it("Delete", async () => {
    const res = await request(app).delete(`/data/${dataReturned.id}`);
    expect(res.statusCode).toEqual(204);
  });
});
describe("Bonus", () => {
  it("Try to read deleted record", async () => {
    const res = await request(app).get(`/data/${dataReturned.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(null);
  });
});
