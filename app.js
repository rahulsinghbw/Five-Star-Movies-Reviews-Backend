const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/error");
require("express-async-errors");
require("dotenv").config();
require("./db/index");

const app = express();

const userRouter = require("./routes/user"); // Here we import the router from user.js routes
const actorRouter = require("./routes/actor");
const movieRouter = require("./routes/movie");
const reviewRouter = require("./routes/review");
const adminRouter = require("./routes/admin");

const { use } = require("./controller/user");
const { handleNotFound } = require("./utils/helper");
// MVC -> Modal View Controller => MVC is a way where we can split our code according to their behaviour
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(errorHandler);

app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);

app.use("/*", handleNotFound);

app.post(
  "/sign-in",
  (req, res, next) => {
    //This is middleware function where we can use next() function.

    const { email, password } = req.body;

    if (!email || !password)
      return res.json({ error: "email/password missing!" });

    next();
  },
  (req, res) => {
    res.send(" <h1> Hello I'm from your backend about! </h1>");
  }
);

app.listen(8000, () => {
  console.log("Listening to the port 8000");
});
