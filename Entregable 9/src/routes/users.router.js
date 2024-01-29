import { Router } from 'express';
import { usersController } from '../controller/users.controller.js';

export const router = Router()

router.get('/', usersController.getUsers) // Get all users

router.post('/', usersController.createUser) // Create one user
