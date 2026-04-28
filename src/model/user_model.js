import mongoose from "mongoose";

const User_Schema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true,unique:true,lowercase:true},
    password:{type:String,required:true},
    gender:{type:String,enum:['male','female','other'],required:true},
    role:{type:String,enum:['user','admin','manager'],default:'user'},
    validation:{
        user:{
            isDelete:{type:Boolean,default:false},
            isvarification:{type:Boolean,default:false},
            userotp:{type:String,default:null},
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

const user=mongoose.model('test',User_Schema)

export default user