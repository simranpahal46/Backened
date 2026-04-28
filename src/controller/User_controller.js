import user_model from '../model/user_model.js'
import { Validname, Validemail, Validpassword } from '../validation/user_validation.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { EmailOtp, resent_otp } from '../mail/user_mail.js'

export const create_user = async (req, res) => {
    try {

        const data = req.body

        const { name, email, password, gender } = data


        if (!name) return res.status(400).send({ status: false, msg: "name is required" })
        if (!Validname) return res.status(400).send({ status: false, msg: "Name is invalid" })

        if (!email) return res.status(400).send({ status: false, msg: "email is required" })
        if (!Validemail) return res.status(400).send({ status: false, msg: "Email is invalid" })

        if (!password) return res.status(400).send({ status: false, msg: "password is required" })
        if (!Validpassword) return res.status(400).send({ status: false, msg: "Password is invalid" })

        const otp = crypto.randomInt(1000, 10000);
        const otpexpire = Date.now()+1000*60*5

        const Check_User = await user_model.findOneAndUpdate({ email: email },
            {$set:{'validation.user.userotp':otp,'validation.user.otpexpire':otpexpire}})
        if (Check_User) {

            const { isDelete, block, isvarification } = Check_User.validation.user
            if (isDelete) return res.status(400).send({ status: false, msg: "account delete" })

            if (block) return res.status(400).send({ status: false, msg: "account false" })

            if (isvarification) return res.status(400).send({ status: false, msg: "account verify please login" })
            resent_otp(email, Check_User.name, otp)

            return res.status(400).send({ status: false, msg: "email already exist" })
        }

        EmailOtp(email, name, 8080)
 
        const DBData = {
            email,
            name,
            gender,
            password: await bcrypt.hash(password,10),
            validation: { user: { userotp: otp,otpexpire } }
        };
        console.log(DBData)
        const DB = await user_model.create(DBData)

        res.send({ status: true, msg: "user create sucessfully", data: DB })
    }
    catch (e) {
        res.status(500).send({ status: false, msg: e.message })
    }
}