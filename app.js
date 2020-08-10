const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

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
// const patient2 = new FullName({
//   firstName: "Kate",
//   lastName: "Doe",
// });

const defaultPatients = [patient1];

const listSchema = { name: String, items: [fullNamesSchema] };

const List = mongoose.model("List", listSchema);

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  // let currentDay = date.getDate();
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
        listTitle: "Today",
        newPatient: foundItems,
      });
    }
  });
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;

  const listName = req.body.list;

  const patient = new FullName({
    firstName: firstName,
    lastName: lastName,
  });
  if (listName === "Today") {
    patient.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(patient);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

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

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    FullName.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
