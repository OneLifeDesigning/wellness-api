const cors = require("cors");

const corsMiddleware = cors({
  origin: "http://localhost:8000",
  allowedHeaders: ["Content-Type"],
  credentials: true,
});
module.exports = corsMiddleware;
