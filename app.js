const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const date = require(__dirname + "/date");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const fullNames = ["XXX"];
// const regularPatientNames = [];

mongoose.connect("mongodb://localhost:27017/queuelistDB", {
  useNewUrlParser: true,
});
const fullNamesSchema = {
  firstName: String,
  lastName: String,
};
const FullName = mongoose.model("FullName", fullNamesSchema);

const patient1 = new FullName({
  firstName: "John",
  lastName: "Doe",
});
const patient2 = new FullName({
  firstName: "Kate",
  lastName: "Doe",
});

const defaultPatients = [patient1, patient2];

const listSchema = { name: String, items: [fullNamesSchema] };

const List = mongoose.model("List", listSchema);

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let currentDay = date.getDate();
  FullName.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      FullName.insertMany(defaultPatients, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: currentDay,
        newPatient: foundItems,
      });
    }
  });
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;

  const patient = new FullName({
    firstName: firstName,
    lastName: lastName,
  });
  patient.save();
  res.redirect("/");
});

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //create new list
        const list = new List({ name: customListName, items: defaultPatients });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //show an existing list
        res.render("list", {
          listTitle: foundList.name,
          newPatient: foundList.items,
        });
      }
    }
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

app.post("/delete", function (req, res) {
  const chekedItemId = req.body.checkbox;
  FullName.findByIdAndRemove(chekedItemId, function (err) {
    if (!err) {
      console.log("Succesfully deleted checked item!");
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
