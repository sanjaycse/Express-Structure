const mongoose = require('mongoose')
const Joi = require('joi');
const {categorySchema} = require('../models/categoryModel')



const studentSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 20},
    phone: {
        type: String,
        required: true,
        minlength:10,
        maxlength: 15
    },
    isEnrolled:{
        type: Boolean,
        required: true,
        default:false
    },
    category:{
        type: categorySchema,
        required: true
    },
    username:String,
    password:{
        type: String,
        required: true,
        minlength:3
        // maxlength: 100
    }
})

const Student = new mongoose.model('Student', studentSchema)



function validateData(Student){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(3).required(),
        // category: Joi.string.min(3).required(),
        password: Joi.string().min(3).required(),
        isEnrolled: Joi.boolean()
    });

    return schema.validate(Student)  

}


exports.Student = Student
exports.validateData = validateData