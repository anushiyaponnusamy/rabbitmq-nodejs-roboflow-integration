const mongoose = require('mongoose');
const { Schema } = mongoose;

const kitchensafetySchema = new Schema({
  image: {
    type: String,  
    required: true,
  },
  traceId: {
    type: String,  
    required: true,
    unique: true, 
  },
  modelPrediction: {
    type: Boolean,  
    required: true,
    default:false
  },
  roboflowPrediction: {
    type: Boolean,  
    required: true,
    default:false
  },
}, {
  timestamps: true, 
});

const Kitchensafety = mongoose.model('kitchensafety', kitchensafetySchema,'kitchensafety');

module.exports = Kitchensafety;
