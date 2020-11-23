require("dotenv").config();
require("../config/db.config");
const Data = require("../models/data.model");

const fs = require("fs");
const path = require("path");
const fastcsv = require("fast-csv");

const dataFolder = path.join(__dirname, "./csv");

const getData = async () => {
  await fs.readdirSync(dataFolder).forEach((file) => {
    const filePath = `${dataFolder}/${file}`;
    console.log(filePath);
    const stream = fs.createReadStream(filePath);

    const csvData = [];
    const csvStream = fastcsv
      .parse({ discardUnmappedColumns: true })
      .on("data", (data) => {
        console.log(data);
        data[0] !== undefined &&
          csvData.push({
            date: new Date(data[0]),
            hours: Number(data[1]),
            consumition: Number(data[2]),
            price: Number(data[3]),
            cost: Number(data[4]),
          });
      })
      .on("end", async () => {
        csvData.shift();
        console.log(csvData.length);
        await setData(csvData);
      });
    stream.pipe(csvStream);
  });
};

const setData = async (dataFromCsv) => {
  dataFromCsv.map((newData) => {
    const data = new Data(newData);
    data
      .save()
      .then(() => {})
      .catch();
  });
};

const restoreDatabase = () => {
  return Promise.all([Data.deleteMany()]);
};
const seeds = async () => {
  await restoreDatabase()
    .then(async () => {
      await getData()
        .then(() => {})
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

seeds();
