import user_model from '../model/user_model.js'
import crypto from 'crypto'
import { EmailOtp } from '../mail/user_mail.js'
import { error } from 'console'

export const create_user = async (req, res) => {
    try {

        const data = req.body

        const { name, email, password, gender } = data

        const otp = crypto.randomInt(1000, 10000);
        const otpexpire = Date.now()+1000*60*5

        const Check_User = await user_model.findOneAndUpdate(
            { email: email ,'validation.user.isvarification':false},
            {$set:{'validation.user.userotp':otp,'validation.user.otpexpire':otpexpire}})

        if (Check_User)  return res.status(200).send({ status: false, msg: "Otp sent succesfully" })
        
        const DBData = {
            name,
            email,
            gender,
            password,
            validation: { user: { userotp: otp,otpexpire } }
        };


        const DB = await user_model.create(DBData)
        console.log(DB)
        EmailOtp(email, name, otp)

        res.send({ status: true, msg: "user create sucessfully", data: DB })
    }
    catch (e) {
        res.status(500).send(error(e,res))
    }
}