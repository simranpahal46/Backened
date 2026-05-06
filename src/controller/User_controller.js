import user_model from '../model/user_model.js'
import crypto from 'crypto'
import { EmailOtp,resent_otp } from '../mail/user_mail.js'
import { error } from '../error/errorhandling.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const create_user = async (req, res) => {
    try {

        const data = req.body

        const { name, email, password, gender } = data

        const otp = crypto.randomInt(1000, 10000);
        const otpexpire = Date.now() + 1000 * 60 * 5

        const Check_User = await user_model.findOneAndUpdate(
            { email: email },
            { $set: { 'validation.user.userotp': otp, 'validation.user.otpexpire': otpexpire } })

        if (Check_User) {
            if(Check_User.validation.user.isvarification) return res.status(200).send({status:true,msg:"already verify pls login"})
                EmailOtp(Check_User.email,Check_User.name,otp)
            return res.status(200).send({ status: false, msg: "Otp sent succesfully" })
        }

        const DBData = {
            name,
            email,
            gender,
            password,
            validation: { user: { userotp: otp, otpexpire: otpexpire } }
        };


        const DB = await user_model.create(DBData)
        EmailOtp(email, name, otp)

        res.send({ status: true, msg: "user create sucessfully", data: DB })
    }
    catch (e) {
        res.status(500).send(error(e, res))
    }
}

export const verify_otp = async (req, res) => {
    try {
        const { id } = req.params

        const otp = req.body.otp
        if (!otp) return res.status(400).send({ status: false, msg: "pls provide otp" })

        const CheckUser = await user_model.findById(id)
        if (!CheckUser) return res.status(404).send({ status: false, msg: "User not found" })

        const { userotp, otpexpire } = CheckUser.validation.user

        
        if (!(Date.now() <= otpexpire)) return res.status(400).send({ status: false, msg: "otp expire" })

        if (otp != userotp) return res.status(400).send({ status: false, msg: " wrong otp " })

        await user_model.findByIdAndUpdate(id, { $set: { 'validation.user.isvarification': true } })

        return res.status(200).send({ status: true, msg: "User fetched or verify successfully" })
    }
    catch (e) {
        res.status(400).send(error(e, res))
    }
}

export const resend_otp = async (req, res) => {
    try {
        const { id } = req.params

        const expirtTime = Date.now() + 1000 * 60 * 5
        const randomOtp = crypto.randomInt(1000, 9999)

        const updatedOtp = await user_model.findOneAndUpdate({ _id: id },
            { $set: {'validation.user.isvarification': false, 'validation.user.userotp': randomOtp, 'validation.user.otpexpire': expirtTime } }
        )
        if (!updatedOtp) return res.status(404).send({ status: false, msg: 'user not found' })
        resent_otp(updatedOtp.email, updatedOtp.name, randomOtp)

        res.status(200).send({ status: true, msg: 'resend otp send' ,data:{id:updatedOtp._id,email:updatedOtp.email,otp:randomOtp}})
    }
    catch (e) { error(e, res) }
}

export const LogIn = async (req, res) => {
    try {
        const { email, password } = req.body

        const checkUser = await user_model.findOne({ email: email })
        if (!checkUser) return res.status(404).send({ status: false, msg: 'user not found' })

        if (checkUser) {
            const { isvarification, isDelete, block } = checkUser.validation.user
            if (!isvarification) return res.status(404).send({ status: false, msg: 'pls verify otp' })
            if (isDelete) return res.status(404).send({ status: false, msg: 'Account is Delete' })
            if (block) return res.status(404).send({ status: false, msg: 'Your Account is block by Admin' })
        }

        const checkPass = await bcrypt.compare(password, checkUser.password)
        if (!checkPass) return res.status(404).send({ status: false, msg: 'wrong password' })

        const token = jwt.sign({ id: checkUser._id }, process.env.UserTokenKey, { expiresIn: '1d' })

        res.status(200).send({ status: true, msg: 'logIn Succ', token, id: checkUser._id })
    }
    catch (e) { error(e, res) }
}