const express = require('express');
var router = express.Router();
const {Category, validateData} = require('../models/categoryModel');


exports.GetallCategories = async (req,res)=>{
    const categories = await Category.find()
    res.send(categories)
}


exports.GetCategorybyId = async (req,res)=>{
    const category = await Category.findById(req.params.id)
    if(!category) return res.status(404).send('This')
    res.send(category)
}

exports.AddnewCategory = async (req, res) => {
    const {error, value} = validateData(req.body)
    if(error){
        res.status(404).send(error.details[0].message)
    }else{
        const category = Category({
            name: req.body.name
        })
        await category.save();
        res.send(category)
    }
    
}

exports.UpdateCategorybyId = async (req, res) => {
    const categoryName = req.body.name;
    const {error, value} = validateData(req.body)
    if(error){
      res.status(404).send(error.details[0].message)
    }else{
      const category = await Category.findByIdAndUpdate(req.params.id,{name: categoryName}, {new:true})
      // If the category with the given ID is found
      if (category) {
        res.send(category);
      } else {
          // If the category with the given ID is not found, send a 404 error
          res.status(404).send("Category not found");
      }
    }


    
}

exports.DeleteCategorybyId = async (req, res) => {
    // Find the category with the given ID
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (deletedCategory) {
        // If the category with the given ID is found and deleted, send back a success message
        res.send("Category deleted successfully");
    } else {
        // If the category with the given ID is not found, send a 404 error
        res.status(404).send("Category not found");
    }
}


exports.DeleteAllCategories = async (req, res) => {
    // Delete all Categories
    const deletedCategories = await Category.deleteMany();

    if (deletedCategories) {
        // If the Categories deleted, send back a success message
        res.send("All Categories deleted successfully");
    } else {
        // If the Categories is not found, send a 404 error
        res.status(404).send("Categories not found");
    } 
}