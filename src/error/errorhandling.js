export const error=(e,res)=>{
       if(err.name==='ValidationError') return res.status(400).send({status:false,msg:err.message})
       if(err.name==='CastError') return res.status(400).send({status:false,msg:"Mongoose id invalid"})
    
    return res.status(500).send({status:false,msg:e.message})
}