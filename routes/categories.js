const express = require('express');
const { GetallCategories, GetCategorybyId, AddnewCategory, UpdateCategorybyId, DeleteCategorybyId, DeleteAllCategories } = require('../controllers/categoryController');
var router = express.Router();



  
  router.get('/', GetallCategories)
  router.get('/:id', GetCategorybyId)
  router.post('/', AddnewCategory)
  router.put('/:id', UpdateCategorybyId)
  router.delete('/:id', DeleteCategorybyId)
  router.delete('/', DeleteAllCategories)




  

module.exports = router;