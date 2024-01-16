const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
// Schema - describes and enforces the structure of the documents
const sudentSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  linkedinUrl: String,
  languages: [String],
  program: String,
  background: String,
  image: String,
  project: String,
});

// CREATE MODEL
// The model() method defines a model (Student) and creates a collection (students) in MongoDB
// The collection name will default to the lowercased, plural form of the model name:
//                          "Student" --> "students"
const Student = mongoose.model("Student", sudentSchema);

// EXPORT THE MODEL
module.exports = Student;
