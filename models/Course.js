const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Iniciante', 'Intermediario', 'Avanćado'], required: true },
  duration: { type: String, required: true },
  nextClass: { type: Date },
  image: { type: String },
  syllabus: [{ type: String }],
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);