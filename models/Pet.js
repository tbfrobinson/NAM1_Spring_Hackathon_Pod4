const mongoose = require('mongoose')

const PetSchema = new mongoose.Schema({
  category: {
    type: String
  }
}, {
  timestamps: false
})

module.exports = mongoose.model('Pet', PetSchema)