var mongoose = require('mongoose');

var ElectionSchema = new mongoose.Schema({
  title: {
    type: String
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date
  },
  duration: {
    type: Number, default: 84600000
  },
  status: {
    type: String,
    enum: ['ongoing', 'paused', 'finished'],
    default: 'ongoing'
  },
  smart_contract: {
    contract_abi: {
      type: Object
    },
    contract_address: {
      type: String
    }
  },
  options: [{
    type: String
  }],
  voters: [{
      type: String
    }],
  launcher: {
    type: String
  }, //change it to user
  contract: {
    type: String
  }

})

module.exports = mongoose.model('Elections', ElectionSchema);