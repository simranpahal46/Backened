import user_model from '../model/user_model.js'
import crypto from 'crypto'
import { EmailOtp } from '../mail/user_mail.js'
import { error } from '../error/errorhandling.js'

export const create_user = async (req, res) => {
    try {

        const data = req.body

        const { name, email, password, gender } = data

        const otp = crypto.randomInt(1000, 10000);
        const otpexpire = Date.now() + 1000 * 60 * 5

        const Check_User = await user_model.findOneAndUpdate(
            { email: email, 'validation.user.isvarification': false },
            { $set: { 'validation.user.userotp': otp, 'validation.user.otpexpire': otpexpire } })

        if (Check_User) return res.status(200).send({ status: false, msg: "Otp sent succesfully" })

        const DBData = {
            name,
            email,
            gender,
            password,
            validation: { user: { userotp: otp, otpexpire:otpexpire } }
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

        const time = Date.now()
        if (!(time <= otpexpire)) return res.status(400).send({ status: false, msg: "otp expire" })

        if (otp != userotp) return res.status(400).send({ status: false, msg: " wrong otp " })

        await user_model.findByIdAndUpdate(id, { $set: { 'validation.user.isvarification': true } })

     return res.status(200).send({ status: true, msg: "User fetched successfully", data: CheckUser })
    }
    catch (e) {
        res.status(400).send(error(e, res))
    }
}