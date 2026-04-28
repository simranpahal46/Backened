import user_model from '../model/user_model.js'
import { Validname, Validemail, Validpassword } from '../validation/user_validation.js'
// import bcrypt from 'bcrypt'
// import crypto from 'crypto'
import { EmailOtp, resent_otp } from '../mail/user_mail.js'

export const create_user = async (req, res) => {
    try {

        const data = req.body

        const { name, email, password } = data


        if (!name) return res.status(400).send({ status: false, msg: "name is required" })
        if (!Validname) return res.status(400).send({ status: false, msg: "Name is invalid" })

        if (!email) return res.status(400).send({ status: false, msg: "email is required" })
        if (!Validemail) return res.status(400).send({ status: false, msg: "Email is invalid" })

        if (!password) return res.status(400).send({ status: false, msg: "password is required" })
        if (!Validpassword) return res.status(400).send({ status: false, msg: "Password is invalid" })


        const Check_User = await user_model.findOne({ email: email })
        if (Check_User) {

            const { isDelete, block, isvarification } = Check_User.validation.user
            if (isDelete) return res.status(400).send({ status: false, msg: "account delete" })

            if (block) return res.status(400).send({ status: false, msg: "account false" })

            if (isvarification) return res.status(400).send({ status: false, msg: "account verify please login" })
            resent_otp(email, name, 1900)
            
            return res.status(400).status({ status: false, msg: "email already exist" })
        }

        EmailOtp(email, name, 8080)

        // const bcryptPassword = await bcrypt.hash(password, 10)
        // data.password = bcryptPassword

        // const randomotp = crypto.randomInt(1000, 10000)
        // const expirydate = Date.now() + 1000 * 60 * 5
        // data.validation = {
        //     user: {
        //         userotp: randomotp,
        //         otpexpire: expirydate
        //     }
        // }

        const DB = await user_model.create(data)

        res.send({ status: true, msg: "user create sucessfully", data: DB })
    }
    catch (e) {
        res.status(500).send({ status: false, msg: e.message })
    }
}