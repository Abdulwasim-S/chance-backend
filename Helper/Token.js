import jwt from 'jsonwebtoken';

const generateToken = async(value)=>{
    const token = await jwt.sign({id:value},process.env.SECRET_KEY,{expiresIn:'1h'});
    return token;
}
export {generateToken};