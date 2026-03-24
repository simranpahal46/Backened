import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import router from './routes/User_routes.js'

dotenv.config()

const app=express()
const port=process.env.port

app.use(express.json())

mongoose.connect(process.env.Mongo_Url)
.then(()=>console.log('Database connected'))
.catch((e)=>console.log('Database not connected'))

app.use('/',router)

app.listen(port,()=>console.log(`Server is running ${port}`))