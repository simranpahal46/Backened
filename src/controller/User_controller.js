import user_model from '../model/user_model.js'
import { Validname, Validemail, Validpassword } from '../validation/user_validation.js'
import bcrypt from 'bcrypt'

export const create_user = async(req, res) => {
    try {

        const data = req.body

        const { name, email, password } = data

        if (!Validname) return res.status(400).send({ status: false, msg: "Name is invalid" })
        if (!Validemail) return res.status(400).send({ status: false, msg: "Email is invalid" })
        if (!Validpassword) return res.status(400).send({ status: false, msg: "Password is invalid" })

        if (!name) return res.status(400).send({ status: false, msg: "name is required" })
        if (!email) return res.status(400).send({ status: false, msg: "email is required" })
        if (!password) return res.status(400).send({ status: false, msg: "password is required" })

        const bcryptPassword = await bcrypt.hash(password, 10)
        data.password=bcryptPassword

        const Check_User= await user_model.findOne({email:email})
        if(Check_User) return res.status(400).status({status:false,msg:"email already exist"})

            const DB=await user_model.create(data)

        res.send({status:true,msg:"user create sucessfully",data:DB})
    }
    catch (e) {
        res.status(500).send({ status: false, msg: e.message })
    }
}