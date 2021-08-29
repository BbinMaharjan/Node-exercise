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
app.use(express.urlencoded({ extended: true }));

// mongoose and mongi sanbox routes
app.post("/add-message", (req, res) => {
  // console.log(req.body);
  const bootcamp = new Bootcamp(req.body);
  bootcamp
    .save()
    .then((result) => {
      res.redirect("/message");
    })
    .catch((err) => {
      console.log(err);
    });
});

// geting Single User details
app.get("/messages/details/:id", (req, res) => {
  const id = req.params.id;
  Bootcamp.findById(id)
    .then((result) => {
      res.render("details", { item: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// deleting user
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  Bootcamp.findByIdAndDelete(id)
    .then((result) => {
      res.redirect("/message");
    })
    .catch((err) => {
      console.log(err);
    });
});

// update user
app.post("/update/:id", (req, res) => {
  const id = req.params.id;
  Bootcamp.findByIdAndUpdate(id, req.body)
    .then((result) => {
      console.log(result);
      res.redirect("/message");
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

// 404 page
app.use((req, res) => {
  res.render("404");
});
