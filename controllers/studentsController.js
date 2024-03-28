const express = require('express');
var router = express.Router();
const {Student , validateData} = require('../models/studentsModel');

exports.GetallStudents = async (req,res)=>{
    const students = await Student.find()
    res.send(students)
}


exports.GetStudentsbyId = async (req,res)=>{
    const student = await Student.findById(req.params.id)
    if(!student) return res.status(404).send('This Student not found in our record')
    res.send(student)
}

exports.AddnewStudent = async (req, res) => {
    const {error, value} = validateData(req.body)
    if(error){
        res.status(404).send(error.details[0].message)
    }else{
        const student = Student({
            name: req.body.name,
            phone: req.body.phone,
            isEnrolled: req.body.isEnrolled
        })
        await student.save();
        res.send(student)
    }
    
}

exports.UpdateStudentbyId = async (req, res) => {
    const studentName = req.body.name;
    const isEnrolled = req.body.isEnrolled;
    const phone = req.body.phone;

    const student = await Student.findByIdAndUpdate(req.params.id,{ name: studentName, isEnrolled: isEnrolled, phone: phone }, {new:true})
    // If the student with the given ID is found
    if (student) {
        res.send(student);
    } else {
        // If the Student with the given ID is not found, send a 404 error
        res.status(404).send("Student not found");
    }  
}


exports.DeleteStudentbyId = async (req, res) => {
    // Find the Student with the given ID
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (deletedStudent) {
        // If the Student with the given ID is found and deleted, send back a success message
        res.send("All Student deleted successfully");
    } else {
        // If the Student with the given ID is not found, send a 404 error
        res.status(404).send("Student not found");
    }
}

exports.DeleteAllStudents = async (req, res) => {
    // Delete all Students
    const deletedStudent = await Student.deleteMany();

    if (deletedStudent) {
        // If the Students deleted, send back a success message
        res.send("Students deleted successfully");
    } else {
        // If the Student is not found, send a 404 error
        res.status(404).send("Student not found");
    } 
}