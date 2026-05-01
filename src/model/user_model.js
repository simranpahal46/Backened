import mongoose from "mongoose";
import { Validname, Validemail, Validpassword,Validgender } from '../validation/user_validation.js'
import bcrypt from 'bcrypt'


const User_Schema=new mongoose.Schema({
    name:{type:String,required:[true,"Name is Required"],validate:[Validname,"Invalid Name"],trim:true},
    email:{type:String,required:[true,"Email is Required"],validate:[Validemail,"Invalid Email"],trim:true,unique:true,lowercase:true},
    password:{type:String,required:[true,"Password is Required"],validate:[Validpassword,"Invalid Password"]},
    gender:{type:String,enum:['male','female','other'],required:[true,"gender is Required"],validate:[Validgender,"Invalid Gender"]},
    role:{type:String,enum:['user','admin','manager'],default:'user'},
    validation:{
        user:{
            isDelete:{type:Boolean,default:false},
            isvarification:{type:Boolean,default:false},
            userotp:{type:Number,default:null},
            otpexpire:{type:Number,default:null},
            blocktype:{type:String,enum:['delete','block','unblock'],default:'unblock'},
            block:{type:Boolean,default:null}
        },
        admin:{ 
            adminotp:{type:Number,default:null},
            otpexpire:{type:Date,default:null},
        }
    }
},
{timestamps:true}
)

User_Schema.pre('save',async function () {
    this.password=await bcrypt.hash(this.password,10)
})

const user=mongoose.model('test',User_Schema)

export default user