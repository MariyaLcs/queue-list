const express = require("express");
const bodyParser = require("body-parser");

const date = require(__dirname + "/date");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const fullNames = ["XXX"];
const regularPatientNames = [];

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let currentDay = date.getDate();

  res.render("list", {
    listTitle: currentDay,
    newPatient: fullNames,
  });
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const fullName = `${firstName} ${lastName}`;

  if (req.body.list === "regular-patient") {
    regularPatientNames.push(fullName);
  } else {
    fullNames.push(fullName);
    res.redirect("/");
  }
});

app.get("/regular-patient", function (req, res) {
  res.render("list", {
    listTitle: "Regular Patient",
    newPatient: regularPatientNames,
  });
});

app.post("/regular-patient", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const fullName = `${firstName} ${lastName}`;
  regularPatientNames.push(fullName);
  res.redirect("/regular");
});

// app.get("/firstVisit", function (req, res) {
//   res.render("list", { listTitle: "" });
// });

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
