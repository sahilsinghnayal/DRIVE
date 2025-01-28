const mongoose = require("mongoose");
function connectToDb() {
  mongoose.connect("mongodb://0.0.0.0/men-drive").then(() => {
    console.log("connected to db");
  });
}
module.exports = connectToDb;
