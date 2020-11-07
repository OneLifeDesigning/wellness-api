const cors = require("cors");

if (process.env.DEV === "dev") {
  const corsMiddleware = cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type"],
    credentials: true,
  });
  module.exports = corsMiddleware;
} else {
  const whitelist = [process.env.CORS_ORIGIN_ONE, process.env.CORS_ORIGIN_TWO];

  const corsMiddleware = cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    allowedHeaders: ["Content-Type"],
    credentials: true,
  });

  module.exports = corsMiddleware;
}
