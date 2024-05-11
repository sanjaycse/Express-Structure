const express = require('express');
var router = express.Router();
const { GetDashboard,
        GetallStudents,
        GetStudentsbyId,
        AddnewStudent,
        UpdateStudentbyId, 
        DeleteStudentbyId, 
        DeleteAllStudents, 
        LoginStudent 
    } = require('../controllers/studentsController');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sanjayisgoodboy';

  
router.get('/', GetallStudents)
router.get('/:id', GetStudentsbyId)
router.post('/', AddnewStudent)
router.put('/:id', authenticateToken, UpdateStudentbyId)
router.delete('/:id', DeleteStudentbyId)
router.delete('/', DeleteAllStudents)
router.post('/login', LoginStudent)

// router.get('/dashboard', GetDashboard);


function authenticateToken(req, res, next) {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    // If no token is provided, return 401 Unauthorized
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }
  
    // Verify the JWT token
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = user;
      next();
    });
}

module.exports = router;