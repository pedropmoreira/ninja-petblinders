const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser , login,getUserbyId } = require('../../controllers/userControllers/userController');
const checkToken = require('../../middleware/checkToken')


const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/login', login);
router.get('/:id',checkToken ,getUserbyId);


module.exports = router;
