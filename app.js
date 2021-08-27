const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const Bootcamp = require("./models/bootcamp");

// connect to mongodb
const dbURI =
  "mongodb+srv://bbin:bbin123@node.jl0e6.mongodb.net/node-exercise?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then((result) =>
    app.listen(8080, () => {
      console.log("Server is running on http://localhost:8080/");
    })
  )
  .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");

// middleware and static files
app.use(express.static("public"));
app.use(morgan("dev"));

// mongoose and mongi sanbox routes
app.get("/add-bootcamp", (req, res) => {
  const bootcamp = new Bootcamp({
    firstName: req.query.firstname,
    lastName: req.query.lastname,
    email: req.query.email,
    mobile: req.query.mobile,
    message: req.query.message,
  });
  bootcamp
    .save()
    .then((result) => {
      res.redirect("/bootcamp");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/bootcamp", (req, res) => {
  res.render("bootcamp");
});

app.get("/message", (req, res) => {
  Bootcamp.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("message", { items: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
