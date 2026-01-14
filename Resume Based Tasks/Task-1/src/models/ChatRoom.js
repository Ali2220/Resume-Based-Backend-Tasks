const mongoose = require("mongoose");


const roomSchema = new mongoose.Schema({
    
  id:{
    type: String,
  }, 
  name: {
    type: String,
  },
});

module.exports = mongoose.model("Room", roomSchema);
