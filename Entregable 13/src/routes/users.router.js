import { Router } from 'express';
import { usersController } from '../controller/users.controller.js';

export const router = Router()

router.get('/', usersController.getUsers) // Get all users
//router.get('/:email', usersController.getUserByEmail)

router.post('/', usersController.createUser) // Create one user
router.put('/premium/:uid', usersController.updateRole)

// Password reset
router.post('/pwdReset01', usersController.pwdReset01)
router.get('/pwdReset02', usersController.pwdReset02)
router.post('/pwdReset03', usersController.pwdReset03)
