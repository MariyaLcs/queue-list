module.exports = getDate;

function getDate() {
  let today = new Date();
  let options = { weekday: "long", day: "numeric", month: "long" };
  let currentDay = today.toLocaleDateString("en-US", options);
  return currentDay;
}
