const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema({
   title: {type: String, required: true},
   description: {type: String},
   user: {type: String},
   priority: {type: String, enum: ['Baja', 'Normal', 'Alta', 'Urgente']},
   priority_code: {type: Number, enum: [1,2,3,4]},
   created_at: {type: String},
   done: {type: Boolean, default: false},
   finished_at: {type: String}
});

module.exports = mongoose.model('Task', TaskSchema)
