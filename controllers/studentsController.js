const express = require('express');
const {Student , validateData} = require('../models/studentsModel');
const {Category} = require('../models/categoryModel')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sanjayisgoodboy';

exports.GetallStudents = async (req,res)=>{
    try{
        const students = await Student.find()
        res.send(students)
    }catch(error){
        res.status(404).send(error)
    }
}


exports.GetStudentsbyId = async (req,res)=>{
    try{
        const student = await Student.findById(req.params.id)
        if(!student) return res.status(404).send('This Student not found in our record')
        student.password = undefined;
        res.send(student)
    }catch(error){
        res.status(404).send(error)
    }
}

exports.AddnewStudent = async (req, res) => {
    try {
        // const {error, value} = validateData(req.body)
        const username = req.body.username;
        const phone = req.body.phone;
        const user = await Student.findOne({
            $or: [
            { username: username },
            { phone: phone }
            ]
        });
        const categoryIds = req.body.categoryId;
        const category = await Category.find({ _id: { $in: categoryIds } });
        // if(!category) return res.status(400).send('Invalid ID')

        if (category.length !== categoryIds.length) {
            return res.status(400).send('One or more category IDs are invalid');
        }


        if(user){
            res.status(404).send("This username or phone is already registered")
        }else{
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            const student = await Student({
                name: req.body.name,
                phone: req.body.phone,
                isEnrolled: req.body.isEnrolled,
                category: category.map(cat => ({
                    _id: cat._id,
                    name: cat.name
                })),
                username: req.body.username,
                password:secPass
            })
            await student.save();
            // Exclude password from the student object
            student.password = undefined;
            const payload = {
                user:{
                    id: student.id
                }
            }
            // const authToken = jwt.sign(payload, JWT_SECRET);
            // res.send({student});
            // res.send(student)
            res.send({
                student: {
                    _id: student._id,
                    name: student.name,
                    phone: student.phone,
                    isEnrolled: student.isEnrolled,
                    category: student.category,
                    username: student.username
                }
            });
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
    
}

exports.UpdateStudentbyId = async (req, res) => {
    try {
        const updateFields = {};
        
        // Check and add name if present in request body
        if (req.body.name) {
            updateFields.name = req.body.name;
        }

        // Check and add isEnrolled if present in request body
        if (req.body.isEnrolled !== undefined) {
            updateFields.isEnrolled = req.body.isEnrolled;
        }

        // Check and add phone if present in request body
        if (req.body.phone) {
            updateFields.phone = req.body.phone;
        }

        // Check and add password if present in request body
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            updateFields.password = secPass;
        }

        // Check and add category if present in request body
        if (req.body.categoryId) {
            const categoryIds = req.body.categoryId;
            const category = await Category.find({ _id: { $in: categoryIds } });
            if (!category) return res.status(400).send('Please Enter Valid Category ID');

            updateFields.category = category.map(cat => ({
                _id: cat._id,
                name: cat.name
            }));
        }

        if (req.body.username) {
            res.send("We cannot change the Username once student is added.");
        } else {
            const student = await Student.findByIdAndUpdate(req.params.id, updateFields, { new: true });
            if (student) {
                res.send(student);
            }
        }   
    } catch (error) {
        res.status(404).send(error.message);
    }
}





exports.DeleteStudentbyId = async (req, res) => {
    try{
        // Find the Student with the given ID
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        const students = await Student.find()

        if (deletedStudent) {
            // If the Student with the given ID is found and deleted, send back a success message
            res.send(students);
        } else {
            // If the Student with the given ID is not found, send a 404 error
            res.status(404).send("Student not found");
        }
    }catch(error){
        res.status(404).send(error.message);
    }
}

exports.DeleteAllStudents = async (req, res) => {
    try{
        // Delete all Students
        const deletedStudent = await Student.deleteMany();

        if (deletedStudent) {
            // If the Students deleted, send back a success message
            res.send("Students deleted successfully");
        } else {
            // If the Student is not found, send a 404 error
            res.status(404).send("Student not found");
        }
    }catch(error){
        res.status(404).send(error.message)
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
        console.status(404).error(error.message);
    }
}


// exports.GetDashboard = async (req, res) => {
//     // res.render('index', { title: 'Home' });
//     res.send("sanjay");
// }