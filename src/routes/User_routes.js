import express from 'express'
import {create_user,verify_otp} from '../controller/User_controller.js'

const router=express.Router()

router.post('/create_user',create_user)
router.post('/verify_otp/:id',verify_otp)

export default router
