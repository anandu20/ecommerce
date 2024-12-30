import pkg  from 'jsonwebtoken'
const { verify } = pkg;

export default async function Auth(req,res,next) {
    try{
        const key = req.headers.authorization;
        if(!key){
            return res.status(403).send({msg:"Unauthoized Access"});
        }

        const token = key.split(" ")[1];

        if(!token){
            return res.status(403).send({msg:"Token missing"});

        }
        const auth = await verify(token,process.env.JWT_KEY);

        req.user = auth;

        next();
    }
    catch(error){

        console.log(error);
        
        return res.status(404).send({msg:"Session expired or invalid token"})   
        
    }
    
}