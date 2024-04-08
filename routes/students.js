const express = require('express');
var router = express.Router();
const { GetallStudents, GetStudentsbyId, AddnewStudent, UpdateStudentbyId, DeleteStudentbyId, DeleteAllStudents, LoginStudent } = require('../controllers/studentsController');

  
router.get('/', GetallStudents)
router.get('/:id', GetStudentsbyId)
router.post('/', AddnewStudent)
router.put('/:id', UpdateStudentbyId)
router.delete('/:id', DeleteStudentbyId)
router.delete('/', DeleteAllStudents)
router.post('/login', LoginStudent)

module.exports = router;