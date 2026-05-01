export const error=(e,res)=>{
       if(err.name==='ValidationError') return res.status(400).send({status:false,msg:err.message})
    
    return res.status(500).send({status:false,msg:e.message})
}