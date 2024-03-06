import { Router } from 'express';
import { usersController } from '../controller/users.controller.js';

export const router = Router()

router.get('/', usersController.getUsers) // Get all users
router.get('/:email', usersController.getUserByEmail)

router.post('/', usersController.createUser) // Create one user
