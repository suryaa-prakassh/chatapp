const express = require("express");
const { Server } = require("socket.io");
const helmet = require("helmet");
const session = require("express-session");
const cors = require("cors");
const authRouter = require("./routers/authRouters.js");
require("dotenv").config();
const app = express();

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: "true",
  },
});

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIRONMENT === "production",
      httpOnly: true,
      sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
    },
  })
);

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("ok");
});

io.on("connect", () => {});

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});
