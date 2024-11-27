const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../../controllers/userControllers/userController');


const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
