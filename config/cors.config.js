const cors = require("cors");

const corsMiddleware = cors({
  origin: "http://localhost:3000",
  allowedHeaders: ["Content-Type"],
  credentials: true,
});
module.exports = corsMiddleware;
