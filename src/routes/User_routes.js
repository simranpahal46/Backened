import express from 'express'
import {create_user,verify_otp,resend_otp,LogIn} from '../controller/User_controller.js'

const router=express.Router()

router.post('/create_user',create_user)
router.post('/verify_otp/:id',verify_otp)
router.get('/resend_otp/:id',resend_otp)
router.post('/LogIn',LogIn)

export default router
