const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

let fullNames = ["XXX"];

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let today = new Date();
  const options = { weekday: "long", day: "numeric", month: "long" };
  let currentDay = today.toLocaleDateString("en-US", options);

  res.render("list", { kindOfDay: currentDay, newPatient: fullNames });
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const fullName = `${firstName} ${lastName}`;
  fullNames.push(fullName);
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
