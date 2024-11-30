
import express from 'express'
import { googleLogin, login, registration } from '../auth/auth.controllers'

const router = express.Router()

router.post('/register',registration)
router.post('/login',login)
router.post('/google-login',googleLogin)


export default router
