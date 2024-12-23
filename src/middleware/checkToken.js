
const jwt = require('jsonwebtoken');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


function checkToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1];


    if(!token){
        return res.status(401).json({msg:"Acesso negado!"})
    }

    try{
        const secret = process.env.SECRET
        jwt.verify(token,secret)

        next()
    }catch(error){
        res.status(400).json({msg:"Token invalido"})
    }
}
module.exports = checkToken;