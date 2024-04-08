const express = require('express');
var router = express.Router();
const {Student , validateData} = require('../models/studentsModel');
const {Category} = require('../models/categoryModel')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sanjayisgoodboy';

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
    // const {error, value} = validateData(req.body)
    const category = await Category.findById(req.body.categoryId)
    if(!category) return res.status(400).send('Invalid ID')


    // if(error){
    //     res.status(404).send(error.details[0].message)
    // }else{
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        console.log(secPass)
        const student = await Student({
            name: req.body.name,
            phone: req.body.phone,
            isEnrolled: req.body.isEnrolled,
            category:{
                _id: category._id,
                name: category.name
            },
            username: req.body.username,
            password:secPass
        })
        await student.save();
        const payload = {
            user:{
                id: student.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        res.send({authToken});
        // res.send(student)
    // }
    
}

exports.UpdateStudentbyId = async (req, res) => {
    const studentName = req.body.name;
    const isEnrolled = req.body.isEnrolled;
    const phone = req.body.phone;
    const username = req.body.username;

    const category = await Category.findById(req.body.categoryId)
    if(!category) return res.status(400).send('Invalid ID')

    const student = await Student.findByIdAndUpdate(req.params.id,{ 
        name: studentName, 
        category:{
            _id: category._id,
            name: category.name
        }, 
        isEnrolled: isEnrolled, 
        phone: phone }, {new:true})
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


exports.LoginStudent = async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {username, phone, password} = req.body;
    
    try {
        const user = await Student.findOne({
            $or: [
              { username: username },
              { phone: phone }
            ]
        });
        if (!user) {
            return res.status(400).json({errors: 'Please try with correct credentials!'})
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({errors: 'Please try with correct credentials!'}) 
        }

        const payload = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);

        // Send only necessary user information without password
        const userWithNecessaryData = {
            id: user.id,
            name:user.name,
            username: user.username,
            phone: user.phone,
            category: user.category,
            isEnrolled: user.isEnrolled
            // Add other necessary fields here if any
        };
        res.send({user:userWithNecessaryData, authToken});
    } catch (error) {
        console.error(error.message);
    }
}