import express from 'express';
import { deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/user';

const router = express.Router();

//list users
router.get('/', getAllUsers);

//get one user
router.get('/:id', getUserById);

//update a user
router.put('/:id', updateUser);

//delete a user
router.delete('/:id', deleteUser);

export default router;